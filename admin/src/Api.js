import store from './store';

class Api {

    // 
    constructor() {
        this.baseUrl = "http://127.0.0.1:8000/api/admin";
        // this.baseUrl = "https://parvaty.me/api/admin";
        this.state = store.getState();
        // this.dispatch = useDispatch()
    }

    get = (method, url, data = null, auth = false, success = () => { }, errors = () => { }) => {
        // let Params
        let parameters = {};
        parameters.method = method;

        // set auth header
        if (auth) {
            var authHeaders = new Headers();
            authHeaders.append("Authorization", "Bearer " + this.state.authToken)
            parameters.headers = authHeaders;
        }
        // Form data
        if (data) {
            const formData = this.getFormData(data)
            parameters.body = formData
        }

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
