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
    this.setStatusText("getting machine status...")
    const machine = await this.getMachine()
    if (machine) {
      if (machine.state === "ready")
        this.setStatusText(`${machine.state} (IP: ${machine.publicIpAddress})`)
      else
        this.setStatusText(machine.state)
    } else {
      this.setStatusText("machine not found")
    }
  }

  async setStatusText(/** @type {string} */ text) {
    document.querySelector("#statusText").innerText = text
  }

  async startServer() {
    this.setStatusText("getting machine status...")
    const machine = await this.getMachine()
    this.setStatusText("starting server...")
    await fetch(`https://api.paperspace.io/machines/${machine.id}/start`, {
      headers: {"x-api-key": this.config.paperspaceAPIKey},
      method: "POST"
    })
    this.setStatusText("waiting for started state...")
    await this.waitFor(3000, 10, async() => (await this.getMachine()).state === "ready")
    return this.getStatus()
  }

  async stopServer() {
    this.setStatusText("getting machine status...")
    const machine = await this.getMachine()
    this.setStatusText("stopping server...")
    await fetch(`https://api.paperspace.io/machines/${machine.id}/stop`, {
      headers: {"x-api-key": this.config.paperspaceAPIKey},
      method: "POST"
    })
    this.setStatusText("waiting for stopped state...")
    await this.waitFor(3000, 10, async() => (await this.getMachine()).state === "off")
    this.setStatusText("stopped server.")
  }

  async waitFor(/** @type {number} */ attemptDelayMs, /** @type {number} */ maxAttempts, /** @type {() => Promise<boolean>} */ toRun) {
    /** @param {number} ms */
    const delay = ms => new Promise(res => setTimeout(res, ms))
    for (let loopNo = 0; loopNo < maxAttempts; loopNo += 1) {
      if (await toRun())
        return

      // Do the delay every time but the last loop
      if (loopNo < maxAttempts - 1)
        await delay(attemptDelayMs)
    }
    throw new Error("Timeout waiting for result")
  }
}
