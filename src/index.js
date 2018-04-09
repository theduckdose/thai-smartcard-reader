import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ThaiSmartcardReader extends Component {

  componentDidMount() {
    this.pluginLoaded()
  }
  addEvent(obj, name, func) {
    if (obj.attachEvent) {
      obj.attachEvent(`on${name}`, func)
    } else {
      obj.addEventListener(name, func, false)
    }
  }
  pluginLoaded = () => {
    console.log('loading smartcard plugin')
    const webcard = this.webcard
    this.addEvent(webcard, 'cardpresent', this.cardPresent)
    this.addEvent(webcard, 'cardremoved', this.cardRemoved)
  }
  cardPresent = (reader) => {
    const that = this
    setTimeout(() => that.initCard(reader), 10)
  }
  cardRemoved = () => {
    console.log('card removed!')
    this.props.onChange(null)
  }
  hex2string = (hexx) => {
    let tempHexx = hexx
    if (tempHexx.length > 4) tempHexx = tempHexx.slice(0, -4)
    const patt = /^[a-zA-Z0-9&@.$%\-,():`# \/]+$/
    const hex = tempHexx.toString()
    let str = ''
    let tmp = ''
    for (let i = 0; i < hex.length; i += 2) {
      tmp = String.fromCharCode(parseInt(hex.substr(i, 2), 16))
      if (!tmp.match(patt)) {
        tmp = String.fromCharCode(parseInt(hex.substr(i, 2), 16) + 3424)
      }
      str += tmp
    }
    str = str.replace(/#/g, ' ')
    return str
  }
  initCard = (reader) => {
    console.log('reading card...')
    try {
      const person = {}
      let apdu
      let resp
      let tmp = ''
      reader.connect(1) // 1-Exclusive, 2-Shared
      apdu = '00A4040008A000000054480001' // select before everything, don't remove
      reader.transcieve(apdu)

      // Citizen ID
      apdu = '80B0000402000D'
      resp = reader.transcieve(apdu)
      person.citizenId = this.hex2string(resp)

      // Person Info
      apdu = '80B000110200D1'
      resp = reader.transcieve(apdu)
      tmp = this.hex2string(resp)
      tmp = tmp.split(' ') // split data info
      tmp = tmp.filter(v => v !== '') // filter null
      person.titleTH = tmp[0]
      person.firstnameTH = tmp[1]
      person.lastnameTH = tmp[2]
      person.titleEN = tmp[3]
      person.firstnameEN = tmp[4]
      person.lastnameEN = tmp[5]
      person.birthday = tmp[6].slice(0, -1)
      person.gender = tmp[6].slice(-1)

      // Address
      apdu = '80B01579020064'
      resp = reader.transcieve(apdu)
      tmp = this.hex2string(resp)
      tmp = tmp.split(' ') // split data info
      tmp = tmp.filter(v => v !== '') // filter null
      person.address = tmp

      // ISSUE
      apdu = '80B00167020012'
      resp = reader.transcieve(apdu)
      tmp = this.hex2string(resp)
      if (tmp.length >= 16) {
        person.issueAll = tmp.slice(0, 8)
        person.expire = tmp.slice(8, 16)
      }

      // Image
      let imageApdu = [
        '80B0017B0200FF',
        '80B0027A0200FF',
        '80B003790200FF',
        '80B004780200FF',
        '80B005770200FF',
        '80B006760200FF',
        '80B007750200FF',
        '80B008740200FF',
        '80B009730200FF',
        '80B00A720200FF',
        '80B00B710200FF',
        '80B00C700200FF',
        '80B00D6F0200FF',
        '80B00E6E0200FF',
        '80B00F6D0200FF',
        '80B0106C0200FF',
        '80B0116B0200FF',
        '80B0126A0200FF',
        '80B013690200FF',
        '80B014680200FF'
      ];
      let rawImage = ""
      for (var index in imageApdu) {
        resp = reader.transcieve(imageApdu[index])
        if (resp.length > 4) resp = resp.slice(0, -4)
        rawImage += resp
      }
      person.image = rawImage;
      this.props.onChange(person)
    } catch (e) {
      this.props.onChange(null)
      console.warn(e)
    } finally {
      reader.disconnect()
    }
  }
  render() {
    return (
      <div>
        <object ref={n => {this.webcard = n}} type="application/x-webcard" width="0" height="0" style={{ visibility: 'hidden', position: 'fixed', left: 0, top: 0 }}>
          <param name="onload" value="pluginLoaded" />
        </object>
      </div>
    )
  }
}

ThaiSmartcardReader.propTypes = {
  onChange: PropTypes.func.isRequired
}

export default ThaiSmartcardReader
