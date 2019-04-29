import MiniORM from "./miniorm.js"

export default class VSCodeNow {
  constructor() {
    // @ts-ignore because the type checker isn't very good at async constructors
    return (async() => {
      /** @type {AwardWizConfig} */
      this.config = {
        paperspaceAPIKey: "",
        paperspaceMachineName: "CodeServer"
      }
      this.vscodenow = new MiniORM(this.config)
      this.vscodenow.attachSettingsToDOM()

      return this
    })()
  }

  async getMachine() {
    const machines = await fetch("https://api.paperspace.io/machines/getMachines", {headers: {"x-api-key": this.config.paperspaceAPIKey}}).then(result => result.json())
    return machines.find(checkMachine => checkMachine.name === this.config.paperspaceMachineName)
  }

  async getStatus() {
    document.querySelector("#statusText").innerText = "retrieving..."
    const machine = await this.getMachine()
    if (machine) {
      document.querySelector("#statusText").innerText = machine.state
    } else {
      document.querySelector("#statusText").innerText = "machine not found"
    }
  }

  async startServer() {
    const machine = await this.getMachine()
    await fetch(`https://api.paperspace.io/machines/${machine.id}/start`, {
      headers: {"x-api-key": this.config.paperspaceAPIKey},
      method: "POST"
    })
  }

  async stopServer() {
    const machine = await this.getMachine()
    await fetch(`https://api.paperspace.io/machines/${machine.id}/stop`, {
      headers: {"x-api-key": this.config.paperspaceAPIKey},
      method: "POST"
    })
  }
}
