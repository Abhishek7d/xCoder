import store from './store';

class Api {

    // 
    constructor() {
        // Url
        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
            this.baseUrl = "http://127.0.0.1:8000/api/admin";
        } else {
            this.baseUrl = "https://parvaty.me/api/admin";
        }
        this.state = store.getState();
        // this.dispatch = useDispatch()
    }

    get = (method, url, data = null, auth = false, success = () => { }, errors = () => { }) => {
        // headers
        var headers = new Headers();
        // let Params
        let parameters = {};
        parameters.method = method;

        // set auth header
        if (auth) {
            headers.append("Authorization", "Bearer " + this.state.authToken)
        }
        // Form data
        if (data) {
            if (data.hasOwnProperty('raw')) {
                headers.append("Content-Type", "application/json")
                parameters.body = JSON.stringify(data)
            } else {
                parameters.body = this.getFormData(data)
            }
        }
        parameters.headers = headers;
        // Send
        fetch(this.baseUrl + url, parameters).then(res => res.json())
            .then(
                (result) => {
                    if (result.status === 1) {
                        success(result.data, result.message)
                    } else {
                        errors(result.message)
                    }
                },
                (error) => {
                    errors("Something went wrong, please contact the admin or try again later.")
                }
            )
    }
    getFormData = (data) => {
        const formData = new FormData();
        if (data) {
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    formData.append(key, data[key])
                }
            }
        }
        return formData;
    }
    checkUser = () => {
        this.get("GET", "/check", null, true, (data, msg) => {
            store.dispatch({ type: "set", userPermissions: data })
            localStorage.setItem('userPermissions', JSON.stringify(data));
        }, (error) => {
            console.log(error)
        })
    }
}
export default Api;
