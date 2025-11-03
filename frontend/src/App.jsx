import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import axios from "axios";
import personsService from "./services/persons";
import Notification from "./components/Notification";
import "./index.css";

const App = () => {
  let user = { name: "Kim", city: "Seoul" };
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", phone: "010-4353-5432" },
  ]);
  const [filterValue, setFilterValue] = useState(""); //
  //
  const [confirmMessage, setConfirmMessage] = useState(null);
  //

  // const [newName, setNewName] = useState("");
  // const [newphone, setNewPhone] = useState("");

  useEffect(() => {
    personsService.getAll().then((data) => {
      console.log("가져온데이터:", data);
      setPersons(data);
    });
  }, []);

  const addPerson = (personObject) => {
    personsService
      .addPerson(personObject)
      .then((data) => setPersons([...persons, data]))
      .catch((err) => alert(err));
    // setPersons([...persons, personObject]);
  };

  const modifyPerson = (id, modifyObject) => {
    return personsService.modifyPerson(id, modifyObject).then((data) => {
      console.log("modify데이터다임마", data);
      const modifyPersons = persons.map((person) =>
        person.id === data.id ? data : person
      );
      setPersons(modifyPersons);
    });
  };

  const deletePerson = (id) => {
    if (window.confirm("real루다가 하실거임?")) {
      personsService
        .removePerson(id)
        .then((what) => {
          const deletedPerson = persons.filter(
            (person) => person.id !== what.id
          );
          console.log("deletedPerson 이거아니야?:", deletedPerson);

          setPersons(deletedPerson);
        })
        .catch((err) => {
          console.log("clg", err);
          if (err.status == 404) {
            notifyErrorMessage("", "이미 지워진 사람입니다");
          }
        });
    }
  };

  //추가했을때나 수정햇을때 메세지띄우기 3초후
  const notifyConfirmMessage = (name) => {
    setTimeout(() => {
      setConfirmMessage({ text: `Added ${name}`, type: "success" });
    }, 3000);
  };

  const notifyErrorMessage = (name, message) => {
    setConfirmMessage({ text: `${name} ${message}`, type: "fail" });
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification messageObject={confirmMessage} />
      <Filter filterValue={filterValue} setFilterValue={setFilterValue} />
      <h3>add a new info</h3>
      <PersonForm
        onAddPerson={addPerson}
        persons={persons}
        onModifyPerson={modifyPerson}
        onNotifyConfirmMessage={notifyConfirmMessage}
        onNotifyErrorMessage={notifyErrorMessage}
      />
      <h2>Numbers</h2>
      ...
      <Persons
        persons={persons}
        filterValue={filterValue}
        onDelete={(id) => deletePerson(id)}
        // onDelete={(id) => deletePerson(id)}
      />
    </div>
  );
};

export default App;
