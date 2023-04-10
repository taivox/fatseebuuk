import Footer from "./common/Footer";
import Input from "./form/Input";
import { useState } from "react";


function Login() {
  const [formValues, setFormValues] = useState({
    username: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
    console.log(formValues)
  };

  //send data to backend
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formValues)
    fetch(`${process.env.REACT_APP_BACKEND}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValues),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  };


  return (
    <div>
      <div className="container col-md-4 mt-5">
        <div>
          <div className="text-center">
            <div>
                    <h1 >Welcome to Fatseebuuk!</h1>
              <h2>Login</h2>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center m-2"></div>
          </div>
          <form>
            <div className="col-12">
            
                  <Input
                    className="form-control"
                    type="text"
                    name={"username"}
                    placeholder={"Email / username"}
                    value={formValues.username}
                    onChange={handleChange}
                    errorDiv={null}
                    errorMsg={""}
                    style={{ height: "80px" }}
                  />
                
                <Input
                  className="form-control"
                  type="password"
                  name={"password"}
                  placeholder={"Password"}
                  value={formValues.password}
                  onChange={handleChange}
                  errorDiv={null}
                  errorMsg={""}
                  style={{ height: "80px" }}
                />
              
            </div>
          </form>
        </div>
        <div className="justify-content-between">
        <form onSubmit={handleSubmit}>
            <div className="d-flex  align-items-center m-2">
              <button
                type="submit"
                style={{ width: "100%", height: "80px" }}
                className="btn btn-primary"
              >
                <h6>Login</h6>
              </button>
            </div>
          </form>
          <div className="d-flex  align-items-center">
            <button 
              style={{ width: "100%", height: "80px" }}
              className="btn btn-primary m-2"
            >
                <box-icon type='logo' size="lg" color="white" name='github'></box-icon>
            </button>
            <button
              style={{ width: "100%", height: "80px" }}
              className="btn btn-primary m-2"
            >
                <box-icon name='google' size="lg" color="white" type='logo'  ></box-icon>
            </button>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default Login;
