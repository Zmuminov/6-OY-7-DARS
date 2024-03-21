import { useState, useEffect, useRef } from "react";
import "./App.css";
import { CircleLoader, BeatLoader } from "react-spinners";
import Card from "./components/Card";
function App() {
  const [phones, setPhones] = useState([]);
  const nameRef = useRef("");
  const priceRef = useRef(0);
  const descRef = useRef("");
  const statusRef = useRef("active");
  const [pending, setpending] = useState(false);

  useEffect(() => {
    fetch("https://auth-rg69.onrender.com/api/products/all")
      .then((res) => res.json())
      .then((data) => {
        setPhones(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function validate() {
    return true;
  }
  function handleClick(e) {
    setpending(true);
    const isValid = validate();
    if (isValid) {
      const phone = {
        name: nameRef.current.value,
        description: descRef.current.value,
        status: statusRef.current.value,
        price: priceRef.current.value,
        category_id: 2,
        id: id,
      };
      fetch("https://auth-rg69.onrender.com/api/products", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(phone),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.id) {
            let copied = JSON.parse(JSON.stringify(phones));
            copied.push(data);
            setPhones(copied);
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          nameRef.current.value = "";
          descRef.current.value = "";
          priceRef.current.value = "";
          statusRef.current.value = "";
          setpending(false);
        });
    }
    e.preventDefault();
  }
  function handleDelete(id) {
    let isDelete = confirm("Rostan ham o'chirmoqchimisiz?");
    if (isDelete) {
      fetch(`https://auth-rg69.onrender.com/api/products/${id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.message == "Mahsulot muvaffaqiyatli o'chirildi") {
            let copied = JSON.parse(JSON.stringify(phones));
            copied = copied.filter((el) => {
              return el.id != id;
            });
            setPhones(copied);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  return (
    <>
      <div className="container">
        <h1 className="my-4 text-center">Phones</h1>
        <form className="d-flex w-50 gap-2 flex-column mx-auto">
          <input
            ref={nameRef}
            type="text"
            className="form-control"
            placeholder="Enter name..."
          />
          <input
            ref={priceRef}
            type="number"
            className="form-control"
            placeholder="Enter price..."
          />
          <textarea
            ref={descRef}
            className="form-control"
            rows="3"
            placeholder="Enter description"
          ></textarea>
          <select ref={statusRef} className="form-control">
            <option value="active">Active</option>
            <option value="inactive">InActive</option>
          </select>
          <button
            disabled={pending ? true : false}
            onClick={handleClick}
            className="btn btn-success"
          >
            {pending ? "loading..." : "SAVE"}
          </button>
        </form>
        <div className="card-wrapper my-3 d-flex flex-wrap gap-3 justify-content-center">
          {phones.map((el, index) => {
            return (
              <Card deleteItem={handleDelete} key={index} phone={el}></Card>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default App;
