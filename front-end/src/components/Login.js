import Swal from "sweetalert2"
import Footer from "./common/Footer"
import Input from "./form/Input"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"


function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [errors, setErrors] = useState([])
  const [error, setError] = useState(null) //TODO: vaatame mis sellega teeme veel
  const navigate = useNavigate()

  const hasError = (key) => {
    return errors.indexOf(key) !== -1
  }

  //check if user is logged in and redirect to home page if true
  if (document.cookie.includes("session")) {
    let cookies = document.cookie.split(";")
    cookies.forEach((cookie) => {
      if (cookie.includes("session")) {
        const token = cookie.split("=")[1]
        fetch(`${process.env.REACT_APP_BACKEND}/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token,
          },
        })
          .then((response) => response.status === 200 ? (() => navigate('/'))() : null)
      }
    })
  }

  //send data to backend
  const handleSubmit = (event) => {
    event.preventDefault()

    const payload = {
      email: email,
      password: password,
    }


    let required = [
      { field: payload.email, name: "email" },
      { field: payload.password, name: "password" },
    ]

    required.forEach((req) => {
      if (req.field === "") {
        errors.push(req.name)
      }
    })
    setErrors(errors)

    if (errors.length > 0) {
      return
    }

    const headers = new Headers()
    headers.append("Content-Type", "application/json")

    let requestOptions = {
      body: JSON.stringify(payload),
      method: "POST",
      headers: headers,
    }
    fetch(`${process.env.REACT_APP_BACKEND}/login`, requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: data.message,
          })
          return
        } else {
          document.cookie = `session=Bearer ${data.data}`
          localStorage.setItem("user", JSON.stringify(data.user_id))
          navigate("/")
        }
      })
      .catch(error => {
        setError(error)
      })

  }


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
                placeholder={"Email"}
                onChange={(event) => setEmail(event.target.value)}
                errorDiv={hasError("email") ? "text-danger" : "d-none"}
                errorMsg={"Please enter email"}
                style={{ height: "80px" }}
              />

              <Input
                className="form-control"
                type="password"
                name={"password"}
                placeholder={"Password"}
                onChange={(event) => setPassword(event.target.value)}
                errorDiv={hasError("password") ? "text-danger" : "d-none"}
                errorMsg={"Please enter password"}
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
              onClick={() => navigate("/register")}
              style={{ width: "100%", height: "80px" }}
              className="btn btn-primary m-2"
            >
              Dont have an account? Click here to register!
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div >
  )
}

export default Login
