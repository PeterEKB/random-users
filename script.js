/* * * * APIs * * * */
class APIs {
  rndUser = async () => {
    const bUrl = 'https://randomuser.me/api'

    return await fetch(`${bUrl}`).then((res) => res.json());
  };
}

/* * * * View * * * */

class View {
  disArea = document.querySelector('view');
  dob = this.disArea.querySelector('dob')
  lBar = document.querySelector('loading-bar')
  progress = document.querySelector('progress')
  refresh = document.querySelector('refresh')
}

/* * * * Model * * * */

class Model {
  loaded = 0;
  
  constructor(data) {
    this.apis = data.Apis || data.Api || data.apis || data.api;
    this.view = data.Views || data.View || data.views || data.view;
    this.#listeners
  }

  async getUsers(n = 1, cb) {
    let users = [], x = 0
    this.view.lBar.style.display = `block`
    while(x < n){
      this.res = this.apis.rndUser();
      users.push(await this.res)
      this.loaded = x
      this.total = n
      this.disUsers = `loaded ${x} of ${n}`
      ++x
      this.view.progress.style.width = `${x/n*100}%`
    }
    this.view.lBar.style.display = `none`
    return users
  }
  set disUsers (c){
    const v = this.view

    v.disArea.innerHTML = c
  }
  format (n){
    const res = `
    <card>
      <c-image>
        <img src="${n.picture.thumbnail}" />
      </c-image>
      <profile>
        <name>${n.name.first,n.name.last}</name>
        <email>${n.email}</email>
        <phone>${n.phone}</phone>
        <dob><i class="hidden">${n.dob.date}</i></dob>
      </profile>
    </card>
    `
    return res
  }
  get #listeners(){
    this.view.disArea.addEventListener('click', e => {
      e.target.tagName.toLowerCase() == 'i'
      ?e.target.classList.toggle('hidden')
      :''
    })
    this.view.refresh.addEventListener('click', e => {
      App.refresh
    })
  }
}

/* * * * Controller * * * */

class Controller {
  users = []
  loaded = 0
  constructor(model) {
    [this.model, this.view] = [model];
  }
  get init(){
    const m = this.model,
    v = m.view,
    n = 20,
    usr = m.getUsers(n)

    usr.then((res)=>{
      res.forEach((u)=>{
        this.format = u.results[0]
      })
      m.disUsers = this.users
      // this.users.forEach(u =>{
      //   v.disArea.innerHTML += u
      // })
    })
  }
  get refresh (){
    this.users = []
    console.log(this.users)
    this.init
  }
  set format(s) {
    const m = this.model,
    f = m.format(s)
    console.log(s)

    this.users.push(f)
  }
  set disUsers(s) {
    const d = this.model

    d.disUsers(s)
  }
  set loaded(n){

  }
}

const api = new APIs(),
view = new View(),
model = new Model({ api, view }),
App = new Controller(model);

App.init