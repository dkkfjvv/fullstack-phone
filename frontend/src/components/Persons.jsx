import React from "react";
import Button from "./Button";

const Persons = ({ persons, filterValue, onDelete }) => {
  const filterInfo = persons.filter((person) =>
    person.name.includes(filterValue)
  );

  const filterName = filterInfo.map((info) => (
    <p key={info.name}>
      {info.name} {info.number}
      <Button value="delete" onClick={() => onDelete(info.id)} />
    </p>
  ));
  return <div>{filterName}</div>;
};

export default Persons;
