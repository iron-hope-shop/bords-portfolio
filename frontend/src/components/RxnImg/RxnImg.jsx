import { useEffect, useState } from 'react';
import axios from 'axios';
import { CircularProgress, Container } from '@mui/material';

const apiUrl = 'https://bordsearch.com/api/generate';
// const apiUrl = 'http://localhost:8080/api/generate';

const SmilesImage = ({ smiles }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImage = async () => {
      setLoading(true);
      if (!smiles || smiles.trim() === '') {
        const blankImage = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="300"><rect width="100%" height="100%" fill="transparent" /><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="40">N/A</text></svg>`;
        setImageSrc(blankImage);
        setLoading(false);
        return;
      }

      const encodedSmiles = encodeURIComponent(smiles);
      const url = `${apiUrl}/render_molecule?mol=${encodedSmiles}&type=smiles`;

      try {
        const response = await axios.get(url, { responseType: 'blob' });
        const imageUrl = URL.createObjectURL(response.data);
        setImageSrc(imageUrl);
      } catch (error) {
        console.error('Error fetching image:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [smiles]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
        <CircularProgress style={{ color: 'white', width: '100px', height: '100px' }} />
        </div>
      ) : (
        imageSrc && <img src={imageSrc} alt="Rendered molecule" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      )}
    </div>
  );
};

export default SmilesImage;