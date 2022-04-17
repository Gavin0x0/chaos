import React from "react"
import { Link, Outlet } from "react-router-dom";
import "../css/examplesPage.css"
function ExamplesList(props) {
    const examples = new Array(8).fill(0)
    console.log(examples)
    const examplesList = examples.map((cube, i) => {
        return (
            <Link key={i} className='guide-text' to={"./example" + (i+1)}> Example_{i+1} </Link>
        );
    });
    return examplesList;
}

class Example extends React.Component {
    render() {
        return (
            <div className="two-column-container">
                <div className='list-container'>
                    <h3 style={{ color: "#fff" }} >Choose one example</h3>
                    <ExamplesList />
                </div>
                <div className="example-container">
                    <Outlet />
                </div>

            </div>
        )
    }
}
export default Example