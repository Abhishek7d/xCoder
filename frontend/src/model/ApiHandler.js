import * as conf from './config';
import { read_cookie, delete_cookie } from 'sfcookies';

class ApiHandler {
    constructor() {
        this._url = conf.apiUrl;
    }
    showError =(err)=>{
        console.log(err)
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
                    console.log(error)
                    faild(error.message);
                }
                );
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
            if (response.status === 0) {
                faild(response.message)
            } else if (response.status === 1) {
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
            if (response.status === 0) {
                faild(response.message)
            } else if (response.status === 1) {
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
            if (response.status === 0) {
                faild(response.message)
            } else if (response.status === 1) {
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
        formData.append("password", newPassword);
        formData.append("password_confirmation", confirmPassword);
        formData.append("token", tocken);


        this.getResult("/reset/password", "POST", formData, null, (response) => {
            if (response.status === 0) {
                faild(response.message)
            } else if (response.status === 1) {
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
            if (response.status === 0) {
                if (response.message === "Authentication Faild") {
                    delete_cookie("auth");
                    window.location.href = "/login"
                    return;
                }
                failure(response.message)
            } else if (response.status === 1) {
                success(response.message, response.data);
            } else {
                failure("something went wrong");
            }
        }, failure);
    }

    createServer = (serverName, serverSize, serverLocation, appName, success = () => { }, faild = () => { }) => {
        if (!serverName || !serverSize || !serverLocation || !appName) return;
        let access_token = read_cookie("auth");
        var authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token)
        const formData = new FormData();
        formData.append("name", serverName);
        formData.append("size", serverSize);
        formData.append("region", serverLocation);
        formData.append("appName", appName);
        
        this.getResult("/droplet", "POST", formData, authHeaders, (response) => {
            console.log(response)
            if (response.status === 0) {
                if (response.message === "Authentication Faild") {
                    delete_cookie("auth");
                    window.location.href = "/login"
                    return;
                }
                faild(response.message)
            } else if (response.status === 1) {
                success(response.message, response.data);
            } else {
                faild("something went wrong");
            }
        }, faild);
    }
    deleteServer = (serverId, action, success = () => { }, faild = () => { }) => {
        if (!serverId) return;
        let access_token = read_cookie("auth");
        var authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token)
        const formData = new FormData();
        formData.append("action", action);

        this.getResult("/droplet/" + serverId, "POST", formData, authHeaders, (response) => {
            if (response.status === 0) {
                if (response.message === "Authentication Faild") {
                    delete_cookie("auth");
                    window.location.href = "/login"
                    return;
                }
                faild(response.message)
            } else if (response.status === 1) {
                success(response.message);
            } else {
                faild("something went wrong");
            }
        }, faild);
    }
    getApplications = (success = () => { }, failure = () => { }) => {
        let access_token = read_cookie("auth");
        var authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token)
        this.getResult("/application", "GET", null, authHeaders, (response) => {
            if (response.status === 0) {
                if (response.message === "Authentication Faild") {
                    delete_cookie("auth");
                    window.location.href = "/login"
                    return;
                }
                failure(response.message)
            } else if (response.status === 1) {
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
            if (response.status === 0) {
                if (response.message === "Authentication Faild") {
                    delete_cookie("auth");
                    window.location.href = "/login"
                    return;
                }
                faild(response.message)
            } else if (response.status === 1) {
                success(response.message, response.data);
            } else {
                faild("something went wrong");
            }
        }, faild);
    }
    deleteApplication = (applicationId, success = () => { }, faild = () => { }) => {
        if (!applicationId) return;
        let access_token = read_cookie("auth");
        var authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token)

        this.getResult("/application/" + applicationId, "POST", null, authHeaders, (response) => {
            if (response.status === 0) {
                if (response.message === "Authentication Faild") {
                    delete_cookie("auth");
                    window.location.href = "/login"
                    return;
                }
                faild(response.message)
            } else if (response.status === 1) {
                success(response.message);
            } else {
                faild("something went wrong");
            }
        }, faild);
    }
    logout = (success = () => { }, faild = () => { }) => {
        let access_token = read_cookie("auth");
        var authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token);

        this.getResult("/logout", "POST", null, authHeaders, (response) => {
            if (response.status === 0) {
                faild(response.message)
            } else if (response.status === 1) {
                success(response.message, response.data);
            } else {
                faild("something went wrong");
            }
        });
    }
    getServerSizes = (success = () => { }, faild = () => { }) => {
        let access_token = read_cookie("auth");
        var authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token);

        this.getResult("/sizes", "GET", null, authHeaders, (response) => {
            if (response.status === 0) {
                faild(response.message)
            } else if (response.status === 1) {
                success(response.data);
            } else {
                faild("something went wrong");
            }
        });
    }
    getRegions = (success = () => { }, faild = () => { }) => {
        let access_token = read_cookie("auth");
        var authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token);

        this.getResult("/regions", "GET", null, authHeaders, (response) => {
            if (response.status === 0) {
                faild(response.message)
            } else if (response.status === 1) {
                success(response.data);
            } else {
                faild("something went wrong");
            }
        });
    }
    getResources = (serverId, success = () => { }, faild = () => { }) => {
        if (!serverId) return;
        let access_token = read_cookie("auth");
        let authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token);

        this.getResult("/resouces/"+serverId, "GET", null, authHeaders, (response) => {
            if(response.status === 0){
                faild(response.message)
            }
            else if(response.status === 1){
                success(response.message, response.data)
            }
            else {
                faild("something went wrong")
            }
        }, faild);
    }
    getServicesStatus = (serverId, success = () => { }, faild = () => { }) => {
        if (!serverId) return;
        let access_token = read_cookie("auth");
        let authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token);

        this.getResult("/server/"+serverId, "GET", null, authHeaders, (response) => {
            if(response.status === 0){
                faild(response.message)
            }
            else if(response.status === 1){
                success(response.data)
            }
            else {
                faild("something went wrong")
            }
        }, faild);
    }
    updateService = (serverId, service, action, success = () => { }, faild = () => { }) => {
        action = action ? "start" : "stop";
        let access_token = read_cookie("auth");
        var authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token)
        const formData = new FormData();
        formData.append("service", service);
        formData.append("action", action);

        this.getResult("/server/" + serverId, "POST", formData, authHeaders, (response) => {
            if (response.status === 0) {
                if (response.message === "Authentication Faild") {
                    delete_cookie("auth");
                    window.location.href = "/login"
                    return;
                }
                faild(response.message)
            } else if (response.status === 1) {
                success(response.data);
            } else {
                faild("something went wrong");
            }
        }, faild);
    }
    getCronJobs = (serverId, success = () => { }, faild = () => { }) => {
        if (!serverId) return;
        let access_token = read_cookie("auth");
        let authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token);
        
        this.getResult("/cron/"+serverId, "GET", null, authHeaders, (response) => {
            if(response.status === 0){
                faild(response.message)
            }
            else if(response.status === 1){
                success(response.data)
            }
            else {
                faild("something went wrong")
            }
        }, faild);
    }
    cronAction = (serverId, cronId, action, success = () => { }, faild = () => { }) => {
        if (!serverId) return;
        let access_token = read_cookie("auth");
        let authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token);
        const formData = new FormData();
        formData.append("action", action);

        this.getResult("/cron/"+serverId+"/"+cronId, "POST", formData, authHeaders, (response) => {
            if(response.status === 0){
                faild(response.message)
            }
            else if(response.status === 1){
                success(response.data)
            }
            else {
                faild("something went wrong")
            }
        }, faild);
    }
    cronUpdate = (serverId, cronId, minute, hour, day, month, wday, command, success = () => { }, faild = () => { }) => {
        if (!serverId || !cronId || !command) return;
        let access_token = read_cookie("auth");
        let authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token);
        const formData = new FormData();

        if (typeof typeof minute === "string") {
            minute = "'" + minute + "'";
        }
        if (typeof hour === "string") {
            hour = "'" + hour + "'";
        }
        if (typeof day === "string") {
            day = "'" + day + "'";
        }
        if (typeof month === "string") {
            month = "'" + month + "'"
        }
        if (typeof wday === "string") {
            wday = "'" + wday + "'"
        }
        formData.append("min", minute);
        formData.append("hour", hour);
        formData.append("day", day);
        formData.append("month", month);
        formData.append("wday", wday);
        formData.append("command", command);
        formData.append("action", "change");

        this.getResult("/cron/"+serverId+"/"+cronId, "POST", formData, authHeaders, (response) => {
            if(response.status === 0){
                faild(response.message)
            }
            else if(response.status === 1){
                success(response.message, response.data)
            }
            else {
                faild("something went wrong")
            }
        }, faild);
    }

    addCron = (serverId, minute, hour, day, month, wday, command, success = () => { }, faild = () => { }) => {
        if (!serverId || !command) return;
        let access_token = read_cookie("auth");
        let authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token);
        const formData = new FormData();

        if (typeof typeof minute === "string") {
            minute = "'" + minute + "'";
        }
        if (typeof hour === "string") {
            hour = "'" + hour + "'";
        }
        if (typeof day === "string") {
            day = "'" + day + "'";
        }
        if (typeof month === "string") {
            month = "'" + month + "'"
        }
        if (typeof wday === "string") {
            wday = "'" + wday + "'"
        }
        formData.append("min", minute);
        formData.append("hour", hour);
        formData.append("day", day);
        formData.append("month", month);
        formData.append("wday", wday);
        formData.append("command", command);
        formData.append("action", "change");

        this.getResult("/cron/"+serverId, "POST", formData, authHeaders, (response) => {
            if(response.status === 0){
                faild(response.message)
            }
            else if(response.status === 1){
                success(response.message, response.data)
            }
            else {
                faild("something went wrong")
            }
        }, faild);
    }
    addStorage = (serverId, size, action, success = () => { }, faild = () => { }) => {
        if (!serverId || !size || !action) return;
        let access_token = read_cookie("auth");
        let authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token);
        const formData = new FormData();
        formData.append("server", serverId);
        formData.append("size", size);
        let url = (action === "resize") ? "/storage/resize" : "/storage"
        this.getResult(url, "POST", formData, authHeaders, (response) => {
            if(response.status === 0){
                faild(response.message)
            }
            else if(response.status === 1){
                success(response.message,response.data)
            }
            else {
                faild("something went wrong")
            }
        }, faild);
    }
    deleteStorage = (serverId, success = () => { }, faild = () => { }) => {
        if (!serverId) return;
        let access_token = read_cookie("auth");
        let authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token);
        const formData = new FormData();
        formData.append("server", serverId);
        this.getResult("/storage/delete", "POST", formData, authHeaders, (response) => {
            if(response.status === 0){
                faild(response.message)
            }
            else if(response.status === 1){
                success(response.message,response.data)
            }
            else {
                faild("something went wrong")
            }
        }, faild);
    }
    serverUpgrade = (serverId, size, success = () => { }, faild = () => { }) => {
        if (!serverId || !size) return;
        let access_token = read_cookie("auth");
        let authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token);
        const formData = new FormData();
        formData.append("size", size);
        formData.append("action", "resize");
        this.getResult("/droplet/"+serverId, "POST", formData, authHeaders, (response) => {
            if(response.status === 0){
                faild(response.message)
            }
            else if(response.status === 1){
                success(response.message,response.data)
            }
            else {
                faild("something went wrong")
            }
        }, faild);
    }
    getProjects = (success = () => { }, failure = () => { }) => {
        let access_token = read_cookie("auth");
        var authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token)
        this.getResult("/projects", "GET", null, authHeaders, (response) => {
            if (response.status === 0) {
                if (response.message === "Authentication Faild") {
                    delete_cookie("auth");
                    window.location.href = "/login"
                    return;
                }
                failure(response.message)
            } else if (response.status === 1) {
                success(response.message, response.data);
            } else {
                failure("something went wrong");
            }
        }, failure);
    }

    createProject = (projectName, success = () => { }, faild = () => { }) => {
        if (!projectName) return;
        let access_token = read_cookie("auth");
        var authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token)
        const formData = new FormData();
        formData.append("name", projectName);
        this.getResult("/project", "POST", formData, authHeaders, (response) => {
            console.log(response)
            if (response.status === 0) {
                if (response.message === "Authentication Faild") {
                    delete_cookie("auth");
                    window.location.href = "/login"
                    return;
                }
                faild(response.message)
            } else if (response.status === 1) {
                success(response.message, response.data);
            } else {
                faild("something went wrong");
            }
        }, faild);
    }
    
    updateDomainName = (domainName, applicationId, success=()=>{}, faild=()=>{}) => {
        if(!domainName || !applicationId){
            faild("invalid name");
            return;
        }
        
        let access_token = read_cookie("auth");
        var authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token)
        const formData = new FormData();
        formData.append("domain", domainName);

        this.getResult("/application/"+applicationId+"/update-domain", "POST", formData, authHeaders, (response) => {
            if (response.status === 0) {
                if (response.message === "Authentication Faild") {
                    delete_cookie("auth");
                    window.location.href = "/login"
                    return;
                }
                faild(response.message)
            } else if (response.status === 1) {
                success(response.message);
            } else {
                faild("something went wrong");
            }
        }, faild);
    }
    updateSSL = (applicationId, ssl, success=()=>{}, faild=()=>{}) => {
        if(!applicationId){
            faild("invalid name");
            return;
        }
        
        let access_token = read_cookie("auth");
        var authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token)
        let url = (ssl)?"/application/"+applicationId+"/add-ssl":"/application/"+applicationId+"/remove-ssl";
        this.getResult(url, "POST", null, authHeaders, (response) => {
            if (response.status === 0) {
                if (response.message === "Authentication Faild") {
                    delete_cookie("auth");
                    window.location.href = "/login"
                    return;
                }
                faild(response.message)
            } else if (response.status === 1) {
                success(response.message);
            } else {
                faild("something went wrong");
            }
        }, faild);
    }
    deleteFtpAccount  = (applicationId, username, success=()=>{}, faild=()=>{}) => {
        if(!applicationId || !username){
            faild("invalid name");
            return;
        }
        
        let access_token = read_cookie("auth");
        var authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token)
        let url = "/application/"+applicationId+"/delete-ftp";
        const formData = new FormData();
        formData.append("username", username);

        this.getResult(url, "POST", formData, authHeaders, (response) => {
            if (response.status === 0) {
                if (response.message === "Authentication Faild") {
                    delete_cookie("auth");
                    window.location.href = "/login"
                    return;
                }
                faild(response.message)
            } else if (response.status === 1) {
                success(response.message);
            } else {
                faild("something went wrong");
            }
        }, faild);
    }
    addFtpAccount  = (applicationId, username, password, success=()=>{}, faild=()=>{}) => {
        if(!applicationId || !username || !password){
            faild("invalid name");
            return;
        }
        
        let access_token = read_cookie("auth");
        var authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token)
        let url = "/application/"+applicationId+"/add-ftp";
        const formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);

        this.getResult(url, "POST", formData, authHeaders, (response) => {
            if (response.status === 0) {
                if (response.message === "Authentication Faild") {
                    delete_cookie("auth");
                    window.location.href = "/login"
                    return;
                }
                faild(response.message)
            } else if (response.status === 1) {
                success(response.message);
            } else {
                faild("something went wrong");
            }
        }, faild);
    }
    
}

export default ApiHandler;
