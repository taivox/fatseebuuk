import { useRouteError } from "react-router-dom"

function ErrorPage({ error }) {
    // const error = useRouteError()

    if (error === undefined) {
        error = new Error("Not found")
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <h1 className="mt-3">Oops!</h1>
                    <p>Sorry, an unexpected error has occured.</p>
                    <p>
                        <em>{error.statusText || error.message}</em>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ErrorPage