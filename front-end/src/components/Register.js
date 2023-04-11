import { useState } from "react"
import Footer from "./common/Footer"
import Input from "./form/Input"
import TextArea from "./form/TextArea"
import Swal from "sweetalert2"
import { useNavigate } from "react-router-dom"

function Register() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [nickname, setNickname] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [about, setAbout] = useState("")
  const [passwordsNoMatch, setPasswordsNoMatch] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const MAX_FILE_SIZE = 10 * 1024 * 1024
  const [errors, setErrors] = useState([])
  const navigate = useNavigate()

  const [error, setError] = useState(null)

  const hasError = (key) => {
    return errors.indexOf(key) !== -1
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (!file) {
      return
    }

    if (!file.type.startsWith('image/')) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please select an image file',
      })
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      localStorage.removeItem("profileImage")
      setImagePreview(null)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'File size exceeds the limit of 10 MB!',
      })
      return
    }
    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onload = () => {
      setImagePreview(reader.result)
    }

    localStorage.setItem("profileImage", imagePreview)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setPasswordsNoMatch(false)

    let errors = []
    const payload = {
      first_name: firstName,
      last_name: lastName,
      nickname: nickname,
      date_of_birth: dateOfBirth,
      email: email,
      password: password,
      confirm_password: confirmPassword,
      about: about,
    }

    let required = [
      { field: payload.first_name, name: "first_name" },
      { field: payload.last_name, name: "last_name" },
      { field: payload.date_of_birth, name: "date_of_birth" },
      { field: payload.email, name: "email" },
      { field: payload.password, name: "password" },
      { field: payload.confirm_password, name: "confirm_password" },
    ]


    required.forEach((req) => {
      if (req.field === "") {
        errors.push(req.name)
      }
    })

    setErrors(errors)


    if (payload.password !== payload.confirm_password) {
      setPasswordsNoMatch(true)
      return
    }

    if (errors.length > 0) {
      return
    }

    payload.profile_image = imagePreview
    localStorage.removeItem("profileImage")

    const headers = new Headers()
    headers.append("Content-Type", "application/json")

    let requestOptions = {
      body: JSON.stringify(payload),
      method: "POST",
      headers: headers,
    }
    console.log("headers:",headers)
    console.log("reqopt",requestOptions)

    fetch(`${process.env.REACT_APP_BACKEND}/register`, requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          console.log(data.message)
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: data.message,
          })
          return
        } else {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: "User registered successfully, check your email for details, please log in!",
          })
          navigate("/login")
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
              <h1>Welcome to Fatseebuuk!</h1>
              <h2>Register</h2>
            </div>
          </div>
        </div>
        <div className="row">
          <form onSubmit={handleSubmit}>
            <div className="col-12">
              <div className="d-flex justify-content-between">
                <Input
                  className="form-control"
                  type="text"
                  name={"first_name"}
                  placeholder={"First name"}
                  onChange={(event) => setFirstName(event.target.value)}
                  errorDiv={hasError("first_name") ? "text-danger" : "d-none"}
                  errorMsg={"Please enter first name"}
                  style={{ height: "50px" }}
                />

                <Input
                  className="form-control"
                  type="text"
                  name={"last_name"}
                  placeholder={"Last name"}
                  onChange={(event) => setLastName(event.target.value)}
                  errorDiv={hasError("last_name") ? "text-danger" : "d-none"}
                  errorMsg={"Please enter last name"}
                  style={{ height: "50px" }}
                />
              </div>

              <Input
                className="form-control"
                type="text"
                name={"nickname"}
                placeholder={"Nickname (Optional)"}
                onChange={(event) => setNickname(event.target.value)}
                style={{ height: "50px" }}
              />

              <Input
                className="form-control"
                type="date"
                name={"date_of_birth"}
                placeholder={"Date of Birth"}
                onChange={(event) => setDateOfBirth(event.target.value)}
                errorDiv={hasError("date_of_birth") ? "text-danger" : "d-none"}
                errorMsg={"Please enter date of birth"}
                style={{ height: "50px" }}
              />

              <Input
                className="form-control"
                type="email"
                name={"email"}
                placeholder={"Email"}
                onChange={(event) => setEmail(event.target.value)}
                errorDiv={hasError("email") ? "text-danger" : "d-none"}
                errorMsg={"Please enter email"}
                style={{ height: "50px" }}
              />

              <Input
                className="form-control"
                type="password"
                name={"password"}
                placeholder={"Password"}
                onChange={(event) => setPassword(event.target.value)}
                errorDiv={hasError("password") ? "text-danger" : "d-none"}
                errorMsg={"Please enter password"}
                style={{ height: "50px" }}
              />

              <Input
                className="form-control"
                type="password"
                name={"confirm_password"}
                placeholder={"Confirm password"}
                onChange={(event) => setConfirmPassword(event.target.value)}
                errorDiv={hasError("confirm_password") || passwordsNoMatch ? "text-danger" : "d-none"}
                errorMsg={passwordsNoMatch ? "Passwords don't match" : "Please confirm your password"}
                style={{ height: "50px" }}
              />


              <div className="d-flex justify-content-between">
                <div className="flex-grow-1 me-3">
                  <TextArea
                    className="form-control"
                    type="text"
                    name={"about"}
                    placeholder={"About me... (Optional)"}
                    onChange={(event) => setAbout(event.target.value)}
                    style={{ height: "150px", width: "100%" }}
                  />
                </div>

                <div className="flex-shrink-0 d-flex align-items-center">
                  <label
                    htmlFor="post-image"
                    className="btn btn-light col-md-12"
                    style={{ height: "180px" }}
                  >
                    <img
                      style={{
                        borderRadius: "10px",
                        objectFit: "cover",
                        height: "130px",
                        width: "130px",
                      }}
                      className="col-md-12"
                      src={imagePreview && imagePreview}
                    />
                    <br />
                    <p className="m-2">Add Image (Optional)</p>
                  </label>
                  <input onChange={handleImageUpload} type="file" className="form-control-file d-none" id="post-image" />
                </div>
              </div>
            </div>
            <input
              type="submit"
              style={{ width: "100%", height: "60px" }}
              className="btn btn-primary"
              value={"Register"}
            />
          </form>
        </div>
        <div className="justify-content-between">
          <div className="d-flex  align-items-center m-2">
          </div>
          <div className="d-flex  align-items-center">
            <button
              style={{ width: "100%", height: "60px" }}
              className="btn btn-primary m-2"
            >
              <box-icon type="logo"  size="lg" color="white" name="github"  ></box-icon>
            </button>
            <button
              style={{ width: "100%", height: "60px" }}
              className="btn btn-primary m-2"
            >
              <box-icon type='logo' size="lg" color="white"  name='google'   ></box-icon>
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}


export default Register
