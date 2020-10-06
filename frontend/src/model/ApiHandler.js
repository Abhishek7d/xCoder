import * as conf from './config';
import { bake_cookie, read_cookie, delete_cookie } from 'sfcookies';

class ApiHandler {
    constructor() {
        this._url = conf.apiUrl;
    }
    getResult = (url, method = "GET", data = null, headers = null, success = () => { }, faild = () => { }) => {
        let parameters = {};
        parameters.method = method;
        if (data) {
            parameters.body = data;
        } if (headers) {
            parameters.headers = headers;
        }
        try {
            fetch(this._url + url, parameters)
                .then(response => response.json())
                .then(response => {
                    success(response);
                }
                ).catch((error) => {
                    faild(error.message);
                }
                ).done();
        } catch (error) {
            faild(error.message);
        }

    }
    register = (name, email, password, confPassword, success = () => { }, faild = () => { }) => {
        if (!name || !email || !password || !confPassword) return;
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("confirm_password", confPassword);

        this.getResult("/register", "POST", formData, null, (response) => {
            if (response.status == 0) {
                faild(response.message)
            } else if (response.status == 1) {
                success(response.message, response.data);
            } else {
                faild("someting went wrong");
            }
        });
    }
    login = (email, password, success = () => { }, faild = () => { }) => {
        if (!email || !password) return;
        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);

        this.getResult("/login", "POST", formData, null, (response) => {
            if (response.status == 0) {
                faild(response.message)
            } else if (response.status == 1) {
                success(response.message, response.data);
            } else {
                faild("something went wrong");
            }
        });
    }
    forgotPassword = (email, success = () => { }, faild = () => { }) => {
        if (!email) return;
        const formData = new FormData();
        formData.append("email", email);

        this.getResult("/reset", "POST", formData, null, (response) => {
            if (response.status == 0) {
                faild(response.message)
            } else if (response.status == 1) {
                success(response.message, response.data);
            } else {
                faild("something went wrong");
            }
        });
    }
    resetPassword = (email, newPassword, confirmPassword, tocken, success = () => { }, faild = () => { }) => {
        if (!email) return;
        const formData = new FormData();
        formData.append("email", email);
        formData.append("newPassword", newPassword);
        formData.append("confirmPassword", confirmPassword);
        formData.append("tocken", tocken);


        this.getResult("/password/reset", "POST", formData, null, (response) => {
            if (response.status == 0) {
                faild(response.message)
            } else if (response.status == 1) {
                success(response.message, response.data);
            } else {
                faild("something went wrong");
            }
        });
    }
    getServers = (success = () => { }, failure = () => { }) => {
        let access_token = read_cookie("auth");
        var authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token)
        this.getResult("/droplets", "GET", null, authHeaders, (response) => {
            if (response.status == 0) {
                if (response.message === "Authenticatio Failed") {
                    delete_cookie("auth");
                    window.location.href = "/login"
                    return;
                }
                failure(response.message)
            } else if (response.status == 1) {
                success(response.message, response.data);
            } else {
                failure("something went wrong");
            }
        }, failure);
    }

    createServer = (serverName, serverSize, serverLocation, success = () => { }, faild = () => { }) => {
        if (!serverName || !serverSize || !serverLocation) return;
        let access_token = read_cookie("auth");
        var authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token)
        const formData = new FormData();
        formData.append("name", serverName);
        formData.append("size", serverSize);
        formData.append("region", serverLocation);

        this.getResult("/droplet", "POST", formData, authHeaders, (response) => {
            if (response.status == 0) {
                if (response.message === "Authenticatio Failed") {
                    delete_cookie("auth");
                    window.location.href = "/login"
                    return;
                }
                faild(response.message)
            } else if (response.status == 1) {
                success(response.message, response.data);
            } else {
                faild("something went wrong");
            }
        },faild);
    }
    deleteServer = (serverId, action, success = () => { }, faild = () => { }) => {
        if (!serverId) return;
        let access_token = read_cookie("auth");
        var authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token)
        const formData = new FormData();
        formData.append("action", action);

        this.getResult("/droplet/"+serverId, "POST", formData, authHeaders, (response) => {
            if (response.status == 0) {
                if (response.message === "Authenticatio Failed") {
                    delete_cookie("auth");
                    window.location.href = "/login"
                    return;
                }
                faild(response.message)
            } else if (response.status == 1) {
                success(response.message);
            } else {
                faild("something went wrong");
            }
        },faild);
    }
    getApplications = (success = () => { }, failure = () => { }) => {
        let access_token = read_cookie("auth");
        var authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token)
        this.getResult("/application", "GET", null, authHeaders, (response) => {
            if (response.status == 0) {
                if (response.message === "Authenticatio Failed") {
                    delete_cookie("auth");
                    window.location.href = "/login"
                    return;
                }
                failure(response.message)
            } else if (response.status == 1) {
                success(response.message, response.data);
            } else {
                failure("something went wrong");
            }
        }, failure);
    }
    createApplication = (selectedServerId, selectedDomain, isWordpress, success = () => { }, faild = () => { }) => {
        if (!selectedServerId || !selectedDomain) return;
        let access_token = read_cookie("auth");
        var authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token)
        const formData = new FormData();
        formData.append("domain", selectedDomain);
        formData.append("server", selectedServerId);
        formData.append("wordpress", isWordpress);

        this.getResult("/application", "POST", formData, authHeaders, (response) => {
            if (response.status == 0) {
                if (response.message === "Authenticatio Failed") {
                    delete_cookie("auth");
                    window.location.href = "/login"
                    return;
                }
                faild(response.message)
            } else if (response.status == 1) {
                success(response.message, response.data);
            } else {
                faild("something went wrong");
            }
        },faild);
    }
    deleteApplication = (applicationId, success = () => { }, faild = () => { }) => {
        if (!applicationId) return;
        let access_token = read_cookie("auth");
        var authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token)

        this.getResult("/application/"+applicationId, "POST", null, authHeaders, (response) => {
            if (response.status == 0) {
                if (response.message === "Authenticatio Failed") {
                    delete_cookie("auth");
                    window.location.href = "/login"
                    return;
                }
                faild(response.message)
            } else if (response.status == 1) {
                success(response.message);
            } else {
                faild("something went wrong");
            }
        },faild);
    }
    logout = (password, token, success = () => { }, faild = () => { }) => {
        if (!token || !password) return;
        let access_token = token;
        var authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token)

        const formData = new FormData();
        formData.append("token", token);
        formData.append("password", password);

        this.getResult("/logout", "POST", formData, authHeaders, (response) => {
            if (response.status == 0) {
                faild(response.message)
            } else if (response.status == 1) {
        alert('hi')

                success(response.message, response.data);
            } else {
                faild("something went wrong");
            }
        });
    }
}

export default ApiHandler;
