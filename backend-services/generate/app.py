import logging
import sys
from flask import Flask, request, send_file
from flask_cors import CORS
from rdkit import Chem
from rdkit.Chem import AllChem
from rdkit.Chem.Draw import rdMolDraw2D
import io

# Configure logging
logging.basicConfig(level=logging.DEBUG, stream=sys.stdout)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(
    app,
    resources={
        r"/*": {
            "origins": [
                "http://localhost",
                "http://localhost:5173",
                "https://dev-dot-border-than-u.uc.r.appspot.com",
                "https://bordsearch.com",
            ]
        }
    },
)


@app.route("/_ah/warmup")
def warmup():
    # Perform warmup activities
    logger.info("Warmup request received")
    return "", 200


@app.route("/_ah/health")
def health_check():
    # Perform any necessary health checks
    logger.info("Health check request received")
    return "OK", 200


@app.route("/")
def hello():
    logger.info("Hello route accessed")
    return "", 200


@app.route('/api/generate/render_molecule', methods=['GET'])
def render_molecule():
    logger.info("Render molecule route accessed")
    mol_string = request.args.get("mol", default="", type=str)
    mol_type = request.args.get("type", default="smiles", type=str).lower()
    show_atoms = request.args.get("show_atoms", default="", type=str)

    logger.debug(
        f"Received parameters: mol={mol_string}, type={mol_type}, show_atoms={show_atoms}"
    )

    if not mol_string:
        logger.warning("No molecule string provided")
        return "No molecule string provided", 400

    try:
        # Create drawing options
        opts = rdMolDraw2D.MolDrawOptions()
        opts.bondLineWidth = 3.0
        opts.scaleBondWidth = True
        opts.scalingFactor = 50
        opts.noAtomLabels = True  # Hide all atom labels by default

        # Show only specified atoms
        if show_atoms:
            atoms_to_show = {int(idx): str(idx) for idx in show_atoms.split(",")}
            opts.atomLabels = atoms_to_show

        if mol_type == "smarts":
            logger.debug("Processing SMARTS string")
            mol = Chem.MolFromSmarts(mol_string)
            if mol is None:
                logger.error("Invalid SMARTS string")
                return "Invalid SMARTS string", 400
            AllChem.Compute2DCoords(mol)
        elif mol_type == "smiles":
            logger.debug("Processing SMILES string")
            if ">" in mol_string:
                logger.debug("Processing reaction SMILES")
                parts = mol_string.split(">")
                if len(parts) < 3:
                    logger.error(
                        "Invalid reaction SMILES: must have at least reactants>reagents>products"
                    )
                    return (
                        "Invalid reaction SMILES: must have at least reactants>reagents>products",
                        400,
                    )

                rxn = AllChem.ReactionFromSmarts(mol_string, useSmiles=True)
                if rxn is None:
                    logger.error("Invalid reaction SMILES string")
                    return "Invalid reaction SMILES string", 400

                # Draw the reaction with larger size
                drawer = rdMolDraw2D.MolDraw2DCairo(1500, 450)
                drawer.SetDrawOptions(opts)
                drawer.DrawReaction(rxn)
                drawer.FinishDrawing()
                img = drawer.GetDrawingText()
                img_io = io.BytesIO(img)
                img_io.seek(0)
                logger.info("Reaction image created successfully")
                return send_file(img_io, mimetype="image/png")
            else:
                mol = Chem.MolFromSmiles(mol_string)
                if mol is None:
                    logger.error("Invalid SMILES string")
                    return "Invalid SMILES string", 400
                AllChem.Compute2DCoords(mol)
        else:
            logger.error(f"Invalid molecule type: {mol_type}")
            return "Invalid molecule type. Use 'smarts' or 'smiles'.", 400

        # Scale atom positions
        for atom in mol.GetAtoms():
            pos = list(mol.GetConformer().GetAtomPosition(atom.GetIdx()))
            pos[0] *= 1.5
            pos[1] *= 1.5
            mol.GetConformer().SetAtomPosition(atom.GetIdx(), pos)

        # Draw the molecule
        drawer = rdMolDraw2D.MolDraw2DCairo(800, 800)
        drawer.SetDrawOptions(opts)
        drawer.DrawMolecule(mol)
        drawer.FinishDrawing()
        img = drawer.GetDrawingText()

        img_io = io.BytesIO(img)
        img_io.seek(0)
        logger.info("Molecule image created successfully")
        return send_file(img_io, mimetype="image/png")
    except Exception as e:
        logger.exception(f"Error rendering molecule: {str(e)}")
        return str(e), 500


# The if __name__ == '__main__': block has been removed as it's not needed in App Engine
