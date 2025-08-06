import React from "react";
import styled from "styled-components";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

/* ───────── styled ───────── */
const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;
const Summary = styled.h2`
  font-size: 46px;
  margin: 0;
`;
const DistRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  line-height: 1;
`;
const Bar = styled.div`
  flex: 1;
  height: 10px;
  background: #e6e6e6;
  position: relative;
  border-radius: 6px;
  &:after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 6px;
    background: #ffd814;
    width: ${({ pct }) => pct}%;
  }
`;

/* ───────── helpers ───────── */
const makeDist = (arr = []) => {
  const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  arr.forEach((x) => {
    const k = Math.round(x);
    dist[k] = (dist[k] || 0) + 1;
  });
  return dist;
};
const average = (arr = []) =>
  arr.reduce((s, x) => s + x, 0) / (arr.length || 1);

/* ───────── tiny star row ───────── */
export const Stars = ({ value = 0, size = 20 }) => {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <>
      {[...Array(full)].map((_, i) => (
        <FaStar key={`f${i}`} color="#ffc107" size={size} />
      ))}
      {half && <FaStarHalfAlt color="#ffc107" size={size} />}
      {[...Array(5 - full - (half ? 1 : 0))].map((_, i) => (
        <FaRegStar key={`e${i}`} color="#ffc107" size={size} />
      ))}
    </>
  );
};

/* ───────── main block ───────── */
const Rating = ({ ratings = [] }) => {
  const dist = makeDist(ratings);
  const avg = average(ratings).toFixed(1);

  return (
    <Wrap>
      <Summary>{avg} out of 5</Summary>
      {Object.keys(dist)
        .sort((a, b) => b - a)
        .map((k) => (
          <DistRow key={k}>
            {k} star
            <Bar pct={(dist[k] / ratings.length) * 100} />
            <span>{Math.round((dist[k] / ratings.length) * 100)}%</span>
          </DistRow>
        ))}
    </Wrap>
  );
};

Rating.Stars = Stars;

export default Rating;
