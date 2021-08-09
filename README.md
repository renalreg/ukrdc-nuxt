# ukrdc-nuxt

## Developer Installation

### Prerequisites

- Create a `.env` file, for example:

```
OAUTH_ISSUER=https://renalregistry.okta.com/oauth2/ausn7fa9zfh1DC2La5d6
APP_CLIENT_ID=0oan98slw3m4mnhxq5d6
APP_BASE=/new/app
```

- Ensure a local UKRDC-FastAPI instance is running locally (see <https://github.com/renalreg/ukrdc-fastapi>)

### Installation

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

## Developer notes

### Server-side fetching

In order to enable runtime-configueration, we make use of Nuxt server-side rendering. However, on some pages we want data fetching to always happen client-side. This is usually for pages where mutliple API routes are called, populating the page in "chunks". Usually, we don't want the user to have to wait for every chunk to finish before showing anything (as is the case with server-side fetching), so for these pages we set `fetchOnServer: false`. Now, the server will render the DOM, send this to the client, and the client will then call the API to populate page data.

A primary example of this is when viewing a Master Record. While most record data laods quickly, some queries such as finding related records and messages take longer to run. We want to show the user all data as soon as it's available, so we enforce client-side fetching to allow this.

Similarly, some API routes slow down occasionally due to upstream load, e.g. Mirth message information. We'd rather show users that the data is being loaded rather than just hanging waiting for the page to load at all. By moving fetching to the client-side we can render loading messages/animations and handle timeouts more gracefully.

### Framework rationale

#### Vue

**As opposed to React, Angular, et al.** The choice was really between React and Vue. Vue was chosen primarily because of it's slightly lower barrier-to-entry for new contributors, and because of prior experience with the framework. Either would work fine.

#### Nuxt

**As opposed to "basic" Vue.** Nuxt is a framework based on Vue which provides a couple of useful things. Firstly, it enables partial server-side rendering, which on it's own isn't super useful for us, however it makes working with runtime configurations much simpler. This is useful as we move towards generalsed containers for deployment. On top of this, it provides a nice "all-in-one" solution without needing a separate server application.

Additionally, the Nuxt ecosystem has some really nice plugins such as the Nuxt-Auth plugin we use here. This greatly simplifies security implementations, making it easier to add a good authentication/authorisation layer.

Lastly, the built-in router helps further reduce the barrier-to-entry, using a filesystem based router which should be familiar to anyone who has worked with simple HTML websites previously.

#### Tailwind CSS

**As opposed to Bootstrap, UIKit, et al.** [This article by the libraries author says everything I could include here.](https://adamwathan.me/css-utility-classes-and-separation-of-concerns/)

### Build ARCHITECTURE.md

* Install `pipx`
* `pipx install archmd`
* `archmd . --out "ARCHITECTURE.md" --title="UKRDC-Nuxt Architecture"`
