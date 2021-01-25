import React from "react";

class Status extends React.Component {
    constructor(props) {
        super();
        this.props = props;
        this.status = props.status;
    }

    render() {
        if(this.status==="READY" || this.status == true){
            return (
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 27.5C8.09625 27.5 2.5 21.9037 2.5 15C2.5 8.09625 8.09625 2.5 15 2.5C21.9037 2.5 27.5 8.09625 27.5 15C27.5 21.9037 21.9037 27.5 15 27.5ZM13.7537 20L22.5912 11.1613L20.8237 9.39375L13.7537 16.465L10.2175 12.9288L8.45 14.6962L13.7537 20Z" fill="#58D71D"/>
                </svg>
            )
        }else{
            return(
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 27.5C8.09625 27.5 2.5 21.9037 2.5 15C2.5 8.09625 8.09625 2.5 15 2.5C21.9037 2.5 27.5 8.09625 27.5 15C27.5 21.9037 21.9037 27.5 15 27.5ZM13.75 18.75V21.25H16.25V18.75H13.75ZM13.75 8.75V16.25H16.25V8.75H13.75Z" fill="#FFD302"/>
                </svg>
            )
        }
    }
}
export default Status;
