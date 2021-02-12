import React from "react";
class Pagination extends React.Component {
    constructor(props) {
        super();
        this.props = props
        this.state = {
            data: {},
            links: []
        }
    }
    componentDidMount() {
        this.setState({
            links: this.props.data.links,
            data: this.props.data
        })
    }
    handleClick(link) {
        if (link.url) {
            let page = this.getParameterByName('page', link.url)
            this.props.onPageChange(page)
        }
    }
    getParameterByName(name, url) {
        name = name.replace(/[[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
    renderLinks() {
        let Return = [];
        let links = this.state.links;
        if (links && this.state.data.last_page > 1) {
            links.forEach((link, index) => {
                if (link.label === "&laquo; Previous") {
                    Return.push(<li key={index} className={(link.active) ? "page-item active" : "page-item"}><button className={(link.active) ? "prev page-link active" : "prev page-link"} onClick={() => { this.handleClick(link) }}><i className="fa fa-arrow-left"></i></button></li>)
                } else if (link.label === "Next &raquo;") {
                    Return.push(<li key={index} className={(link.active) ? "page-item active" : "page-item"}><button className={(link.active) ? "next page-link active" : "next page-link"} onClick={() => { this.handleClick(link) }}><i className="fa fa-arrow-right"></i></button></li>)
                } else {
                    Return.push(<li key={index} className={(link.active) ? "page-item active" : "page-item"}><button className={(link.active) ? "page-link active" : "page-link"} onClick={() => { this.handleClick(link) }}>{link.label}</button></li>)
                }
            });
            return Return;
        }
    }
    render() {
        return (
            <div className="float-right">
                <nav aria-label="Page navigation">
                    <ul className="pagination">
                        {this.renderLinks()}
                    </ul>
                </nav>
            </div>
        );
    }
}
export default Pagination;