import React from 'react';
import './account.css';

interface Props {
  name: string;
  color: string;
}

const InfoRuangan: React.FC<Props> = ({ name, color }) => {
  const style = {
    backgroundColor: color,
  };

  return (
    <div className="infoRuang" style={style}>
      <h4>{name}</h4>
    </div>
  );
};

export default InfoRuangan;
