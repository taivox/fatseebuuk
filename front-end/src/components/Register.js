import Footer from "./common/Footer";
import Input from "./form/Input";
import TextArea from "./form/TextArea";

function Register() {
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
          <form>
            <div className="col-12">
              <div className="d-flex justify-content-between">
                <Input
                  className="form-control"
                  type="text"
                  name={"first_name"}
                  value={""}
                  placeholder={"First name"}
                  onChange={null}
                  errorDiv={null}
                  errorMsg={""}
                  style={{ height: "50px" }}
                />
                <Input
                  className="form-control"
                  type="text"
                  name={"last_name"}
                  value={""}
                  placeholder={"Last name"}
                  onChange={null}
                  errorDiv={null}
                  errorMsg={""}
                  style={{ height: "50px" }}
                />
              </div>
              <Input
                className="form-control"
                type="text"
                name={"nickname"}
                value={""}
                placeholder={"Nickname"}
                onChange={null}
                errorDiv={null}
                errorMsg={""}
                style={{ height: "50px" }}
              />

              <Input
                className="form-control"
                type="date"
                name={"date_of_birth"}
                value={""}
                placeholder={"Date of Birth"}
                onChange={null}
                errorDiv={null}
                errorMsg={""}
                style={{ height: "50px" }}
              />

              <Input
                className="form-control"
                type="email"
                name={"email"}
                value={""}
                placeholder={"Email"}
                onChange={null}
                errorDiv={null}
                errorMsg={""}
                style={{ height: "50px" }}
              />

              <Input
                className="form-control"
                type="password"
                name={"password"}
                value={""}
                placeholder={"Password"}
                onChange={null}
                errorDiv={null}
                errorMsg={""}
                style={{ height: "50px" }}
              />

              <Input
                className="form-control"
                type="password"
                name={"passwordCheck"}
                value={""}
                placeholder={"Confirm password"}
                onChange={null}
                errorDiv={null}
                errorMsg={""}
                style={{ height: "50px" }}
              />

              <div className="d-flex justify-content-between">
                <div className="flex-grow-1 me-3">
                  <TextArea
                    className="form-control"
                    type="password"
                    name={"passwordCheck"}
                    value={""}
                    placeholder={"About me..."}
                    onChange={null}
                    errorDiv={null}
                    errorMsg={""}
                    style={{ height: "150px", width: "100%" }}
                  />
                </div>

                <div className="flex-shrink-0 d-flex align-items-center">
                  <label
                    for="post-image"
                    className="btn btn-light col-md-12"
                    style={{ height: "180px" }}
                  >
                    <img
                      style={{
                        borderRadius: "10px",
                        objectFit: "cover",
                        height: "85%",
                        width: "85%",
                      }}
                      className="col-md-12"
                      src={`/profile/default_profile_picture.png`}
                    />
                    <br />
                    <p className="m-2">Add Image</p>
                  </label>
                  <input type="file" className="form-control-file d-none" id="post-image" />
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="justify-content-between">
          <div className="d-flex  align-items-center m-2">
            <button
              style={{ width: "100%", height: "60px" }}
              className="btn btn-primary"
            >
              <h6>Register</h6>
            </button>
          </div>
          <div className="d-flex  align-items-center">
            <button
              style={{ width: "100%", height: "60px" }}
              className="btn btn-primary m-2"
            >
              <box-icon
                type="logo"
                size="lg"
                color="white"
                name="github"
              ></box-icon>
            </button>
            <button
              style={{ width: "100%", height: "60px" }}
              className="btn btn-primary m-2"
            >
              <box-icon
                name="google"
                size="lg"
                color="white"
                type="logo"
              ></box-icon>
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Register;
