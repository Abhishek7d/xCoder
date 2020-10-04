import * as conf from './config';
import { bake_cookie, read_cookie, delete_cookie } from 'sfcookies';

class ApiHandler {
    constructor(){
        this._url = conf.apiUrl;
    }
    getResult = (url, method="GET", data=null, headers=null, success=()=>{}, faild=()=>{})=>{
        let parameters = {};
        parameters.method = method;
        if(data){
            parameters.body = data;
        }if(headers){
            parameters.headers = headers;
        }
        try{
            fetch(this._url+url, parameters)
            .then(response => response.json())
            .then(response => {
                    success(response);
                }
            ).catch((error)=>{
                   faild(error.message);
                }
            ).done();
        }catch(error){
            faild(error.message);
        }

    }
    register = (name, email, password, confPassword, success=()=>{}, faild=()=>{})=>{
        if (!name || !email || !password || !confPassword) return;
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("confirm_password", confPassword);

        this.getResult("/register", "POST", formData, null, (response)=>{
            if(response.status==0){
                faild(response.message)
            }else if(response.status==1){
                success(response.message, response.data);
            }else{
                faild("someting went wrong");
            }
        });
    }
    login = (email, password, success=()=>{}, faild=()=>{})=>{
        if ( !email || !password ) return;
        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);

        this.getResult("/login", "POST", formData, null, (response)=>{
            if(response.status==0){
                faild(response.message)
            }else if(response.status==1){
                success(response.message, response.data);
            }else{
                faild("something went wrong");
            }
        });
    }
    getServers = (success=()=>{}, failure=()=>{})=>{
        let access_token = read_cookie("auth");
        var authHeaders = new Headers();
        authHeaders.append("Authorization", "Bearer "+access_token)
        this.getResult("/droplets", "GET", null, authHeaders, (response)=>{
            if(response.status==0){
                if(response.message==="Authenticatio Faild"){
                    delete_cookie("auth");
                    window.location.href = "/login"
                    return;
                }
                failure(response.message)
            }else if(response.status==1){
                success(response.message, response.data);
            }else{
                failure("something went wrong");
            }
        }, failure);
    }
}

export default ApiHandler;
