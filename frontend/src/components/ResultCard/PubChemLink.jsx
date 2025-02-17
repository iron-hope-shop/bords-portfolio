import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

// Loading placeholder with shimmer effect
const LoadingPlaceholder = () => (
  <svg width="200" height="200" viewBox="0 0 200 200">
    <defs>
      <linearGradient id="shimmer" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0%" stopColor="#f0f0f0">
          <animate
            attributeName="offset"
            values="-1; 2"
            dur="2s"
            repeatCount="indefinite"
          />
        </stop>
        <stop offset="50%" stopColor="#f8f8f8">
          <animate
            attributeName="offset"
            values="-0.5; 2.5"
            dur="2s"
            repeatCount="indefinite"
          />
        </stop>
        <stop offset="100%" stopColor="#f0f0f0">
          <animate
            attributeName="offset"
            values="0; 3"
            dur="2s"
            repeatCount="indefinite"
          />
        </stop>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#shimmer)"/>
    <text 
      x="50%" 
      y="50%" 
      textAnchor="middle" 
      dominantBaseline="middle" 
      fill="#666666" 
      fontSize="16px"
    >
      Loading...
    </text>
  </svg>
);

// N/A placeholder
const NAPlaceholder = () => (
  <svg width="200" height="200" viewBox="0 0 200 200">
    <rect width="100%" height="100%" fill="#e0e0e0"/>
    <text 
      x="50%" 
      y="50%" 
      textAnchor="middle" 
      dominantBaseline="middle" 
      fill="#666666" 
      fontSize="24px"
    >
      N/A
    </text>
  </svg>
);

const PubChemBatchProcessor = {
  queue: new Map(),
  batchSize: 50,
  processingInterval: 3000,
  processing: false,

  async getCidFromName(name) {
    try {
      const response = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(name)}/cids/TXT`);
      if (response.ok) {
        const text = await response.text();
        const cid = text.trim().split('\n')[0];
        return cid && cid !== 'NA' ? cid : null;
      }
    } catch (error) {
      console.error('Failed to fetch CID from name:', error);
    }
    return null;
  },

  addToQueue(input, callback) {
    if (!this.queue.has(input)) {
      this.queue.set(input, []);
    }
    this.queue.get(input).push(callback);
    
    if (!this.processing) {
      this.processBatch();
    }
  },

  async processBatch() {
    this.processing = true;
    
    while (this.queue.size > 0) {
      const batch = Array.from(this.queue.entries())
        .slice(0, this.batchSize);
      
      for (const [input, callbacks] of batch) {
        try {
          // Try SMILES first
          let cid = null;
          const smilesResponse = await fetch('https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/smiles/cids/TXT', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `smiles=${encodeURIComponent(input)}`
          });
          
          if (smilesResponse.ok) {
            const text = await smilesResponse.text();
            cid = text.trim().split('\n')[0];
          }

          // If SMILES fails, try name lookup
          if (!cid || cid === 'NA') {
            cid = await this.getCidFromName(input);
          }

          callbacks.forEach(cb => cb(cid));
          this.queue.delete(input);
        } catch (error) {
          console.error('Failed to fetch CID:', error);
          callbacks.forEach(cb => cb(null));
          this.queue.delete(input);
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, this.processingInterval));
    }
    
    this.processing = false;
  }
};

const PubChemLink = ({ smiles, children }) => {
  const [cid, setCid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (!smiles || smiles === "N/A") {
      setLoading(false);
      return;
    }

    setLoading(true);
    setImageError(false);
    PubChemBatchProcessor.addToQueue(smiles, (fetchedCid) => {
      setCid(fetchedCid);
      setLoading(false);
    });
  }, [smiles]);

  const imageUrl = cid ? 
    `https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=${cid}&t=l` : 
    null;

  return (
    <div className="space-y-2">
      <div>{children}</div>
      <div className="flex space-x-2">
        {loading ? (
          <LoadingPlaceholder />
        ) : !imageError && imageUrl ? (
          <a href={imageUrl} target="_blank" rel="noopener noreferrer">
            <img 
              src={imageUrl}
              alt="Structure"
              style={{ width: '200px', height: '200px' }}
              onError={(e) => {
                console.error(`Failed to load image for CID ${cid}`);
                setImageError(true);
              }}
            />
          </a>
        ) : (
          <NAPlaceholder />
        )}
        
        {cid && (
          <Stack spacing={2} direction="column">
            <Button 
              variant="contained" 
              color="primary" 
              href={`https://pubchem.ncbi.nlm.nih.gov/edit3/index.html?cid=${cid}`}
              target="_blank" 
              rel="noopener noreferrer"
              sx={{ maxWidth: '200px' }}
            >
              View Editor
            </Button>
            <Button 
              variant="contained" 
              color="primary" 
              href={`https://app.molview.org/?cid=${cid}`}
              target="_blank" 
              rel="noopener noreferrer"
              sx={{ maxWidth: '200px' }}
            >
              3D View
            </Button>
            <Button 
              variant="contained" 
              color="primary" 
              href={`https://pubchem.ncbi.nlm.nih.gov/compound/${cid}`}
              target="_blank" 
              rel="noopener noreferrer"
              sx={{ maxWidth: '200px' }}
            >
              PubChem Link
            </Button>
          </Stack>
        )}
      </div>
      <br />
    </div>
  );
};

export { PubChemLink };