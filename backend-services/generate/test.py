import requests
import time
import concurrent.futures
import urllib.parse

# List of molecule strings to test
test_molecules = [
    ('CC(=O)O', 'smiles'),  # Acetic acid
    ('C1=CC=CC=C1', 'smiles'),  # Benzene
    ('C1CCCCC1', 'smiles'),  # Cyclohexane
    ('C(=O)O', 'smiles'),  # Carboxylic acid
    ('C=C', 'smiles'),  # Ethylene
    ('[OH]', 'smarts'),  # Hydroxyl group
    ('O=C(C)C(=O)O', 'smiles'),  # Citric acid
    ('CC(=C)C(=O)O', 'smiles'),  # Acrylic acid
    ('C1CCCCC1C(=O)O', 'smiles'),  # Benzoic acid
    ('C1=CC=C(C=C1)C(=O)O', 'smiles'),  # Benzoic acid (aromatic)
    ('CC(C)(C)C', 'smiles'),  # Neopentane
    ('C1CCNCC1', 'smiles'),  # Piperidine
    ('C1=CN=CN=C1', 'smiles'),  # Pyrimidine
    ('C1=COC=C1', 'smiles'),  # Furan
    ('C1=CSC=C1', 'smiles'),  # Thiophene
    ('C1COCCO1', 'smiles'),  # 1,4-Dioxane
    ('CC(=O)OC(=O)C', 'smiles'),  # Acetic anhydride
    ('ClC1=CC=CC=C1', 'smiles'),  # Chlorobenzene
    ('CC#N', 'smiles'),  # Acetonitrile
    ('C=CC=C', 'smiles'),  # 1,3-Butadiene
    ('[OH:1][CH2:2][CH2:3][N:4]1[CH:8]=[C:7]([CH2:9][NH:10][C:11](=[O:21])[CH2:12][N:13]2[CH:17]=[CH:16][N:15]=[C:14]2[N+:18]([O-:20])=[O:19])[N:6]=[N:5]1.[O:22](S(C1C=CC(C)=CC=1)(=O)=O)[S:23]([C:26]1[CH:32]=[CH:31][C:29]([CH3:30])=[CH:28][CH:27]=1)(=O)=[O:24]>C(Cl)Cl>[CH3:30][C:29]1[CH:31]=[CH:32][C:26]([S:23]([O:1][CH2:2][CH2:3][N:4]2[CH:8]=[C:7]([CH2:9][NH:10][C:11](=[O:21])[CH2:12][N:13]3[CH:17]=[CH:16][N:15]=[C:14]3[N+:18]([O-:20])=[O:19])[N:6]=[N:5]2)(=[O:24])=[O:22])=[CH:27][CH:28]=1', 'smiles'),  # Complex molecule
    ('CC(C)([O-])C.[Na+].Br[C:8]1[CH:13]=[CH:12][C:11]([C:14]2[N:19]=[C:18]([O:20][C:21]3[CH:26]=[C:25]([O:27][CH3:28])[C:24]([O:29][CH3:30])=[C:23]([O:31][CH3:32])[CH:22]=3)[C:17]3=[C:33]([CH3:37])[N:34]=[C:35]([CH3:36])[N:16]3[N:15]=2)=[CH:10][CH:9]=1.[NH:38]1[CH2:43][CH2:42][O:41][CH2:40][CH2:39]1>C1(C)C=CC=CC=1>[CH3:37][C:33]1[N:34]=[C:35]([CH3:36])[N:16]2[C:17]=1[C:18]([O:20][C:21]1[CH:26]=[C:25]([O:27][CH3:28])[C:24]([O:29][CH3:30])=[C:23]([O:31][CH3:32])[CH:22]=1)=[N:19][C:14]([C:11]1[CH:12]=[CH:13][C:8]([N:38]3[CH2:43][CH2:42][O:41][CH2:40][CH2:39]3)=[CH:9][CH:10]=1)=[N:15]2 |f:0.1|', 'smiles'),  # Complex molecule
]

def render_molecule(mol_string, mol_type):
    encoded_mol = urllib.parse.quote(mol_string)
    # url = f'http://localhost:8081/render_molecule?mol={encoded_mol}&type={mol_type}'
    url = f'https://generate-p2vrhuicpq-uc.a.run.app/render_molecule?mol={encoded_mol}&type={mol_type}'
    start_time = time.time()
    response = requests.get(url)
    end_time = time.time()
    return end_time - start_time

def test_sequential():
    total_time = 0
    for mol_string, mol_type in test_molecules:
        total_time += render_molecule(mol_string, mol_type)
    return total_time

def test_parallel():
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        future_to_mol = {executor.submit(render_molecule, mol_string, mol_type): (mol_string, mol_type) for mol_string, mol_type in test_molecules}
        total_time = sum(future.result() for future in concurrent.futures.as_completed(future_to_mol))
    return total_time

if __name__ == '__main__':
    print(f"Testing {len(test_molecules)} molecule strings:")
    
    print("\nSequential rendering:")
    sequential_time = test_sequential()
    print(f"Total time: {sequential_time:.4f} seconds")
    print(f"Average time per molecule: {sequential_time/len(test_molecules):.4f} seconds")

    print("\nParallel rendering:")
    parallel_time = test_parallel()
    print(f"Total time: {parallel_time:.4f} seconds")
    print(f"Average time per molecule: {parallel_time/len(test_molecules):.4f} seconds")