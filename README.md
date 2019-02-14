
# HC-Admin
The refactored implementation of HC-Admin, which now connects with the command line [`holochain` conductor](https://github.com/holochain/holochain-rust/tree/develop/conductor).

**Status:** Closed-Alpha. Early development and testing.

## Purpose:
This is an desktop application to to manage your Holochain application on your local machine. Eventually,this application will also track stats of each app that is running locally and its network interaction.

## Preview:
![HCAdmin-DNA-Instance-Table](/resources/DNA_Instance_Table.png)

![HCAdmin-DNA-Table](/resources/DNA_Table.png)

![HCAdmin-UI-Table](/resources/UI_Table.png)

## Design Decisions:
### With Rust Conductor:
* [HC Container Requirements](https://hackmd.io/ark7OuzNQUaVWQUqhWOYiw?both)
* [HC-Admin ADR](https://hackmd.io/UthCJPttSJSkvk_MJquu3A?both)

Read More :
### With Proto:
* [HCAdmin GUI Design](https://hackmd.io/UthCJPttSJSkvk_MJquu3A)
* [HCAdmin GUI Overview](https://hackmd.io/VqmACbONT9eBl09E-ikLgA?both)

### Current Version - connected to HC-Rust Conductor:
* [HC Container Requirements](https://hackmd.io/ark7OuzNQUaVWQUqhWOYiw?both)
* [HC-Admin ADR](https://hackmd.io/UthCJPttSJSkvk_MJquu3A?both)

### Proto Version - connected to the CLI driven hcshell container:
* [HCAdmin GUI Design](https://hackmd.io/UthCJPttSJSkvk_MJquu3A)
* [HCAdmin GUI Overview](https://hackmd.io/VqmACbONT9eBl09E-ikLgA?both)
* [Link to Proto](https://github.com/Holo-Host/HCAdmin-GUI)

---
## How to run?
#### Set up the Conductor
* In order to successfully deploy HC-Admin, you will first need to setup your holochain-rust conductor.
* To setup, manage, and start your container, please reference the [holochain-rust conductor repository](https://github.com/holochain/holochain-rust/tree/develop/conductor).

#### Run HC-Admin (locally)
`npm install`
`npm run dev`

## Built With
* [Electron](https://electronjs.org/)
* [React](https://reactjs.org/)

## Authors
* **Lisa Jetton** - [JettTech](https://github.com/JettTech)
* **Joel Ulahanna** - [Zo-El](https://github.com/zo-el)

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
