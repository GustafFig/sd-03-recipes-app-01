import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player';

import Card from './Card';

import { handleDrinksData } from '../services/APIs/DRINKS_API';
import { handleFoodsData } from '../services/APIs/FOODS_API';
import './DetailsCard.css';

const defineIndex = (i, s) => {
  if (i === 0 || i === 1) {
    if (s < 1 && s > 0) return true;
    else return false;
  } else if (i === 2 || i === 3) {
    if (s < 2 && s > 3) return true;
    else return false;
  } else if (i === 4 || i === 5) {
    if (s < 4 && s > 5) return true;
    else return false;
  }
}

function DetailsCard({ eat, type }) {
  const [recomends, setRecomends] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [slideIndex, setSlideIndex] = useState(1);

  useEffect(() => {

  }, [slideIndex]);

  useEffect(() => {
    let url = '';
    if (type === 'food') url = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';
    if (type === 'drink') url = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';

    fetch(url).then((res) => res.json())
      .then((obj) => {
        let arr = [];
        Object.entries(obj).forEach(([key, value]) => {
          if (key === 'drinks') arr = value.slice(0, 6).map((drk) => handleDrinksData(drk));
          if (key === 'meals') arr = value.slice(0, 6).map((meal) => handleFoodsData(meal));
        });
        setRecomends(arr);
      }).then(() => setLoading(false))
      .catch((err) => { console.log(err); setError(err); });
  }, [type]);

  const { id, name, srcImage, video, category, ingredients, instructions, isAlcoholic } = eat;

  return (
    <div>
      <Card
        key={id}
        name={name}
        index={-100}
        srcImage={srcImage}
        testid={{ title: 'recipe-title', img: 'recipe-photo' }}
      />
      <p data-testid="recipe-category">Category: {category}</p>
      {(typeof isAlcoholic === 'boolean') && <p>Alcólica: {isAlcoholic ? 'Yup' : 'No'}</p>}
      <ul>
        {ingredients.map(({ ingredient, measure }, index) => (
          <li data-testid={`${index}-ingredient-name-and-measure`} key={ingredient}>
            {ingredient} {measure}
          </li>
        ))}
      </ul>
      <p data-testid="instructions">{instructions}</p>
      {video && <div data-testid="video"><ReactPlayer url={video} /></div>}
      {error.length > 0 && <h3>Aconteceu algo errado em detalhes de comida</h3>}
      {!error && loading && <h3>Carrgando detalhes de comida...</h3>}
      <div className="scroll" onScroll={(e) => console.log(e)}>
        {!error && !loading && recomends && recomends.map(({ id, name: n, srcImage: src }, i) => (
          <Card
            index={i}
            key={id}
            name={n}
            show={(slideIndex * 2) - 2 <= i && i <= (slideIndex * 2) - 1}
            srcImage={src}
            testid={{ title: `${i}-recomendation-title`, img: `${i}-recomendation-card` }}
          />
        ))}
        <a className="prev" onClick={() => setSlideIndex(slideIndex === 1 ? 3 : slideIndex - 1)}>
          &#10094;
        </a>
        <a className="next" onClick={() => setSlideIndex(slideIndex === 3 ? 1 : slideIndex + 1)}>
          &#10095;
        </a>
        <div className="dots-containers" style={{ textAlign: 'center' }}>
          <span className={'dot' + (slideIndex === 1 ? ' active' : '')} onClick={() => setSlideIndex(1)} />
          <span className={'dot' + (slideIndex === 2 ? ' active' : '')} onClick={() => setSlideIndex(2)} />
          <span className={'dot' + (slideIndex === 3 ? ' active' : '')} onClick={() => setSlideIndex(3)} />
        </div>
      </div>
    </div>
  );
}

DetailsCard.propTypes = {
  eat: PropTypes.shape({
    id: PropTypes.string.isRequired, // number as string
    name: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    instructions: PropTypes.string.isRequired,
    origin: PropTypes.string.isRequired,
    srcImage: PropTypes.string.isRequired,
    video: PropTypes.string.isRequired,
    source: PropTypes.string.isRequired,
    ingredients: PropTypes.arrayOf(
      PropTypes.objectOf(
        PropTypes.string.isRequired,
      ).isRequired,
    ).isRequired,
    isAlcoholic: PropTypes.bool,
  }).isRequired,
  type: PropTypes.oneOf(['food', 'drink']).isRequired,
};

export default DetailsCard;