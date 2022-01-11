import { Injectable } from '@angular/core'

interface user{
    uid: string
}

interface username{
    uname: string
}


@Injectable()
export class UserService{

    private user: user
    private username: username

    constructor () {

    }

    setUser(user: user) {
        this.user = user
    }

    getUID() {
        return this.user.uid
    }

    setUsername(username: username) {
        this.username = username
    }

    getUsername() {
        return this.username.uname
    }

}