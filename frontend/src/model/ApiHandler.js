import * as conf from './config';
import { read_cookie, delete_cookie } from 'sfcookies';

class ApiHandler {
    constructor() {
        this._url = conf.apiUrl;
    }
    showError = (err) => {
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
                faild("something went wrong");
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
    resendActivationLink = (email, success = () => { }, faild = () => { }) => {
        if (!email) return;
        const formData = new FormData();
        formData.append("email", email);

        this.getResult("/resend", "POST", formData, null, (response) => {
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
    resetPassword = (email, newPassword, confirmPassword, token, success = () => { }, faild = () => { }) => {
        if (!email) return;
        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", newPassword);
        formData.append("password_confirmation", confirmPassword);
        formData.append("token", token);


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
    changePassword = (email, oldPassword, newPassword, success = () => { }, faild = () => { }) => {
        if (!email) return;
        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", newPassword);
        formData.append("old_password", oldPassword);

        this.getResult("/change/password", "POST", formData, null, (response) => {
            if (response.status === 0) {
                faild(response.message)
            } else if (response.status === 1) {
                success(response.message, response.data);
            } else {
                faild("something went wrong");
            }
        });
    }
    delegateAccess = (email, project, success = () => { }, failure = () => { }) => {
        if (!email || !project) return;
        let access_token = read_cookie("auth");
        const formData = new FormData();
        formData.append("email", email);
        formData.append("project", project);

        var authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token)

        this.getResult("/projects/delegate-access", "POST", formData, authHeaders, (response) => {
            if (response.status === 0) {
                failure(response.message)
            } else if (response.status === 1) {
                success(response.message, response.data);
            } else {
                failure("something went wrong");
            }
        }, failure);
    }
    validateToken = (token, success = () => { }, failure = () => { }) => {
        if (!token) return;
        let access_token = read_cookie("auth");
        const formData = new FormData();
        formData.append("token", token);

        var authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token)

        this.getResult("/access/validate-token", "POST", formData, authHeaders, (response) => {
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
    acceptInvitation = (token, accept, success = () => { }, failure = () => { }) => {
        if (!token) return;
        let access_token = read_cookie("auth");
        const formData = new FormData();
        formData.append("token", token);
        formData.append("accept", accept);

        var authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token)

        this.getResult("/access/accept-invitation", "POST", formData, authHeaders, (response) => {
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
    sendVerificationCode = (id, type = 'server', success = () => { }, failure = () => { }) => {
        if (!id) return;
        let access_token = read_cookie("auth");
        let project = read_cookie('projectId');
        let url = null;

        const formData = new FormData();
        formData.append("id", id);
        formData.append("project_id", project);

        var authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token)
        if (type === 'server') {
            url = "/droplet/send-verification-code";
        } else {
            url = "/project/send-verification-code";
        }
        this.getResult(url, "POST", formData, authHeaders, (response) => {
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
    getDelegateAccess = (project, success = () => { }, failure = () => { }) => {
        let access_token = read_cookie("auth");
        // let project = read_cookie('projectId');
        var authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token)
        this.getResult("/projects/delegate-access/" + project, "GET", null, authHeaders, (response) => {
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
    getDelegateAccount = (success = () => { }, failure = () => { }) => {
        let access_token = read_cookie("auth");
        // let project = read_cookie('projectId');
        var authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token)
        this.getResult("/access/delegate-accounts", "GET", null, authHeaders, (response) => {
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
    deleteDelegateAccess = (id, success = () => { }, failure = () => { }) => {
        let access_token = read_cookie("auth");
        var authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token)
        this.getResult("/projects/delegate-access/delete/" + id, "POST", null, authHeaders, (response) => {
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
    changeDuStatus = (id, status, success = () => { }, failure = () => { }) => {
        let access_token = read_cookie("auth");
        const formData = new FormData();
        formData.append("id", id);
        formData.append("status", status);
        var authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token)
        this.getResult("/projects/delegate-access/status", "POST", formData, authHeaders, (response) => {
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
    getServers = (page = 1, success = () => { }, failure = () => { }) => {
        let access_token = read_cookie("auth");
        let project = read_cookie('projectId');
        var authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token)
        this.getResult("/droplets?project_id=" + project + "&page=" + page, "GET", null, authHeaders, (response) => {
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
        let project = read_cookie('projectId');
        var authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token)
        const formData = new FormData();
        formData.append("name", serverName);
        formData.append("size", serverSize);
        formData.append("region", serverLocation);
        formData.append("appName", appName);

        this.getResult("/droplet?project_id=" + project, "POST", formData, authHeaders, (response) => {
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
    deleteServer = (code, serverId, action, success = () => { }, faild = () => { }) => {
        if (!serverId || !code) return;
        let access_token = read_cookie("auth");
        let project = read_cookie('projectId');
        var authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token)
        const formData = new FormData();
        formData.append("action", action);
        formData.append("code", code);

        this.getResult("/droplet/" + serverId + "?project_id=" + project, "POST", formData, authHeaders, (response) => {
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
    getApplications = (page = 1, success = () => { }, failure = () => { }) => {
        let access_token = read_cookie("auth");
        let project = read_cookie('projectId');
        var authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token)
        this.getResult("/application?project_id=" + project + "&page=" + page, "GET", null, authHeaders, (response) => {
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
        let project = read_cookie('projectId');
        var authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token)
        const formData = new FormData();
        formData.append("domain", selectedDomain);
        formData.append("server", selectedServerId);
        formData.append("wordpress", isWordpress);

        this.getResult("/application/new?project_id=" + project, "POST", formData, authHeaders, (response) => {
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
        let project = read_cookie('projectId');
        var authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token)

        this.getResult("/application/" + applicationId + "?project_id=" + project, "POST", null, authHeaders, (response) => {
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
        let project = read_cookie('projectId');
        var authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token);

        this.getResult("/sizes?project_id=" + project, "GET", null, authHeaders, (response) => {
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
        let project = read_cookie('projectId');
        var authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token);

        this.getResult("/regions?project_id=" + project, "GET", null, authHeaders, (response) => {
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
        let project = read_cookie('projectId');
        let authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token);

        this.getResult("/resources/" + serverId + "?project_id=" + project, "GET", null, authHeaders, (response) => {
            if (response.status === 0) {
                faild(response.message)
            }
            else if (response.status === 1) {
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
        let project = read_cookie('projectId');
        let authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token);

        this.getResult("/server/" + serverId + "?project_id=" + project, "GET", null, authHeaders, (response) => {
            if (response.status === 0) {
                faild(response.message)
            }
            else if (response.status === 1) {
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
        let project = read_cookie('projectId');
        var authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token)
        const formData = new FormData();
        formData.append("service", service);
        formData.append("action", action);

        this.getResult("/server/" + serverId + "?project_id=" + project, "POST", formData, authHeaders, (response) => {
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
        let project = read_cookie('projectId');
        let authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token);

        this.getResult("/cron/" + serverId + "?project_id=" + project, "GET", null, authHeaders, (response) => {
            if (response.status === 0) {
                faild(response.message)
            }
            else if (response.status === 1) {
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
        let project = read_cookie('projectId');
        let authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token);
        const formData = new FormData();
        formData.append("action", action);

        this.getResult("/cron/" + serverId + "/" + cronId + "?project_id=" + project, "POST", formData, authHeaders, (response) => {
            if (response.status === 0) {
                faild(response.message)
            }
            else if (response.status === 1) {
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
        let project = read_cookie('projectId');
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

        this.getResult("/cron/" + serverId + "/" + cronId + "?project_id=" + project, "POST", formData, authHeaders, (response) => {
            if (response.status === 0) {
                faild(response.message)
            }
            else if (response.status === 1) {
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
        let project = read_cookie('projectId');
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

        this.getResult("/cron/" + serverId + "?project_id=" + project, "POST", formData, authHeaders, (response) => {
            if (response.status === 0) {
                faild(response.message)
            }
            else if (response.status === 1) {
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
        let project = read_cookie('projectId');
        let authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token);
        const formData = new FormData();
        formData.append("server", serverId);
        formData.append("size", size);
        let url = (action === "resize") ? "/storage/resize?project_id=" + project : "/storage?project_id=" + project
        this.getResult(url, "POST", formData, authHeaders, (response) => {
            if (response.status === 0) {
                faild(response.message)
            }
            else if (response.status === 1) {
                success(response.message, response.data)
            }
            else {
                faild("something went wrong")
            }
        }, faild);
    }
    deleteStorage = (serverId, success = () => { }, faild = () => { }) => {
        if (!serverId) return;
        let access_token = read_cookie("auth");
        let project = read_cookie('projectId');
        let authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token);
        const formData = new FormData();
        formData.append("server", serverId);
        this.getResult("/storage/delete?project_id=" + project, "POST", formData, authHeaders, (response) => {
            if (response.status === 0) {
                faild(response.message)
            }
            else if (response.status === 1) {
                success(response.message, response.data)
            }
            else {
                faild("something went wrong")
            }
        }, faild);
    }
    serverUpgrade = (serverId, size, success = () => { }, faild = () => { }) => {
        if (!serverId || !size) return;
        let access_token = read_cookie("auth");
        let project = read_cookie('projectId');
        let authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token);
        const formData = new FormData();
        formData.append("size", size);
        formData.append("action", "resize");
        this.getResult("/droplet/" + serverId + "?project_id=" + project, "POST", formData, authHeaders, (response) => {
            if (response.status === 0) {
                faild(response.message)
            }
            else if (response.status === 1) {
                success(response.message, response.data)
            }
            else {
                faild("something went wrong")
            }
        }, faild);
    }
    getProjects = (all = 0, success = () => { }, failure = () => { }) => {
        let access_token = read_cookie("auth");
        //let project = read_cookie('projectId');
        var authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token)
        this.getResult("/projects/" + all, "GET", null, authHeaders, (response) => {
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
        //  let project = read_cookie('projectId');
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
    deleteProject = (projectId, code, success = () => { }, faild = () => { }) => {
        if (!projectId) return;
        let access_token = read_cookie("auth");
        var authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token)
        const formData = new FormData();
        formData.append("id", projectId);
        formData.append("code", code);

        this.getResult("/project/delete", "POST", formData, authHeaders, (response) => {
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
    updateDomainName = (domainName, applicationId, success = () => { }, faild = () => { }) => {
        if (!domainName || !applicationId) {
            faild("invalid name");
            return;
        }
        let project = read_cookie('projectId');
        let access_token = read_cookie("auth");
        var authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token)
        const formData = new FormData();
        formData.append("domain", domainName);

        this.getResult("/application/" + applicationId + "/update-domain?project_id=" + project, "POST", formData, authHeaders, (response) => {
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
    updateSSL = (applicationId, ssl, success = () => { }, faild = () => { }) => {
        if (!applicationId) {
            faild("invalid name");
            return;
        }
        let project = read_cookie('projectId');
        let access_token = read_cookie("auth");
        var authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token)
        let url = (ssl) ? "/application/" + applicationId + "/add-ssl?project_id=" + project : "/application/" + applicationId + "/remove-ssl?project_id=" + project;
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
    deleteFtpAccount = (applicationId, username, success = () => { }, faild = () => { }) => {
        if (!applicationId || !username) {
            faild("invalid name");
            return;
        }
        let project = read_cookie('projectId');
        let access_token = read_cookie("auth");
        var authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token)
        let url = "/application/" + applicationId + "/delete-ftp?project_id=" + project;
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
    addFtpAccount = (applicationId, username, password, success = () => { }, faild = () => { }) => {
        if (!applicationId || !username || !password) {
            faild("invalid name");
            return;
        }
        let project = read_cookie('projectId');
        let access_token = read_cookie("auth");
        var authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token)
        let url = "/application/" + applicationId + "/add-ftp?project_id=" + project;
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
    getNotifications = (page = 1, success = () => { }, failure = () => { }) => {
        let access_token = read_cookie("auth");
        let project = read_cookie('projectId');
        var authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token)
        this.getResult("/notifications?page=" + page + "&project_id=" + project, "GET", null, authHeaders, (response) => {
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
    checkNotifications = (success = () => { }, failure = () => { }) => {
        let access_token = read_cookie("auth");
        let project = read_cookie('projectId');
        var authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token)
        this.getResult("/notifications/check?project_id=" + project, "GET", null, authHeaders, (response) => {
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
    setNotificationStatus = (success = () => { }, failure = () => { }) => {
        let access_token = read_cookie("auth");
        let project = read_cookie('projectId');
        var authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token)
        this.getResult("/notifications/set-status?project_id=" + project, "GET", null, authHeaders, (response) => {
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
    getBackups = (server, app, success = () => { }, failure = () => { }) => {
        let access_token = read_cookie("auth");
        let project = read_cookie('projectId');
        var authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token)
        this.getResult("/backups/" + server + "/" + app + "?project_id=" + project, "GET", null, authHeaders, (response) => {
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
    getAllBackups = (server, success = () => { }, failure = () => { }) => {
        let access_token = read_cookie("auth");
        let project = read_cookie('projectId');
        var authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token)
        this.getResult("/backups/" + server + "?project_id=" + project, "GET", null, authHeaders, (response) => {
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
    createBackups = (server, success = () => { }, failure = () => { }) => {
        let access_token = read_cookie("auth");
        let project = read_cookie('projectId');
        var authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token)
        this.getResult("/backup/create/" + server + "?project_id=" + project, "POST", null, authHeaders, (response) => {
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
    restoreBackup = (server, name, web, db, mail, dns, cron, success = () => { }, failure = () => { }) => {

        const formData = new FormData();
        formData.append("name", name);
        formData.append("web", web);
        formData.append("db", db);
        formData.append("mail", mail);
        formData.append("dns", dns);
        formData.append("cron", cron);
        let project = read_cookie('projectId');
        let access_token = read_cookie("auth");
        var authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer " + access_token)
        this.getResult("/backup/restore/" + server + "?project_id=" + project, "POST", formData, authHeaders, (response) => {
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
}

export default ApiHandler;
