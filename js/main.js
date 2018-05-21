Vue.component('bookmark-item', {
  props: {
    title: {
      type: String,
      required: true
    },
    href: {
      type: String,
      required: true
    }
  },
  computed: {
    icon: function() {
      return this.href.split('://')[0] + '://' + this.href.split('://')[1].split('/')[0] + '/favicon.ico'
    }
  },
  template: `<a class="link" :href="href" :style="'background-image:url(' + icon + ')'">{{ title }}</a>`
})

Vue.component('bookmark-group', {
  props: {
    title: {
      type: String,
      required: true
    },
    links: {
      type: Array,
      required: true
    } 
  },
  template: `
      <div class="group">
        <h1>{{ title }}</h1>
        <div class="links">
          <bookmark-item
            v-for="link in links"
            :title="link.title"
            :href="link.href"
            :key="link.id">
          </bookmark-item>

          <a v-on:click="$emit('show-modal', key)" class="link add-link">+</a>
        </div>
      </div>`
})

var app = new Vue({
  el: "#app",
  data: {
    showModal: false,
    groups: [
      { title: "Personal", links: [
        { title: "Profile", href: "http://david.quotient.space"},
        { title: "Mail", href: "https://mail.protonmail.com"},
        { title: "Github", href: "https://github.com"},
        { title: "Lychee", href: "https://photos.quotient.space"},
        { title: "Profile", href: "http://david.quotient.space"},
        { title: "Mail", href: "https://mail.protonmail.com"},
        { title: "Github", href: "https://github.com"},
        { title: "Lychee", href: "https://photos.quotient.space"},
        { title: "Profile", href: "http://david.quotient.space"},
        { title: "Mail", href: "https://mail.protonmail.com"},
        { title: "Github", href: "https://github.com"},
        { title: "Lychee", href: "https://photos.quotient.space"}
      ]},
      { title: "Social", links: [
        { title: "Mastodon", href: "https://mstdn.io"},
        { title: "Nosykitty", href: "http://github.com/fdavidcl/ask/pulls "}
      ]},
      { title: "Música", links: [
        { title: "study music", href: "https://open.spotify.com/user/fdavidcl/playlist/4Uny81Vv83plUNBBwb30Fr"},
        { title: "Hacker's Coffee", href: "https://open.spotify.com/user/omegak/playlist/4mWcjE2mVcaALYi6v8hDZN"},
        { title: "suomeksi", href: "https://open.spotify.com/user/fdavidcl/playlist/2J77wfgIPNST4Ql5zzk7L9" }
        
      ]}
    ]
  }
})
