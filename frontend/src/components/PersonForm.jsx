import { useState } from "react";

const PersonForm = ({
  onAddPerson,
  persons,
  onModifyPerson,
  onNotifyConfirmMessage,
  onNotifyErrorMessage,
}) => {
  const [newName, setNewName] = useState("");
  const [newphone, setNewPhone] = useState("");

  const submitHandler = (e) => {
    e.preventDefault(); ////
    console.log("클릭들어옴", e); ////

    if (persons.some((person) => person.name === newName)) {
      //원래 있는 사람인데 번호를 다르게 하는거면 바꿔줘야지
      console.log("여기들어와야지?");

      const findPerson = persons.find((person) => person.name === newName);
      console.log("찾았지사람?", findPerson);
      if (
        window.confirm(
          `${findPerson.name}이사람 이미 있는데 진짜로 바꿀거야 번호?`
        )
      ) {
        const modifyObject = { ...findPerson, number: newphone };
        console.log("이걸로 바꿀거지?", modifyObject);

        onModifyPerson(findPerson.id, modifyObject) // 야 여기있는거 오류처리해도 아래있는게 실행이되는가보다..?
          .then(() => {
            console.log("onModifyPerson then에 들어옴");

            onNotifyConfirmMessage(findPerson.name);
          })
          .catch((err) => {
            console.log("err", err);
            console.log("err state", err.status);
            console.log("err true false number", err.status === 404);
            console.log("err true false string", err.status === "404");

            if (err.status === 404) {
              onNotifyErrorMessage(
                findPerson.name,
                "는 이미 지워진 사람입니다"
              );
            }
          });
        setNewName(""); //////
        setNewPhone(""); //////
      }
    } else {
      console.log("여기를 들어왔다고?", newName);
      console.log("여기를 들어왔다고2?", persons);
      console.log(
        "여기를 들어왔다고3?",
        persons.some((person) => person.name !== newName)
      );

      // setPersons([...persons, { name: newName, phone: newphone }]);
      onAddPerson({ name: newName, number: newphone });

      setNewName(""); //////
      setNewPhone(""); //////
      onNotifyConfirmMessage(newName);
    }
  };

  return (
    <form onSubmit={submitHandler}>
      <div>
        name:{" "}
        <input value={newName} onChange={(e) => setNewName(e.target.value)} />
      </div>
      <div>
        phone number:
        <input
          type="text"
          value={newphone}
          onChange={(e) => setNewPhone(e.target.value)}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default PersonForm;
