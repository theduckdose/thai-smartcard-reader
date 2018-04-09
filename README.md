# thai-smartcard-reader
For read thai citizen smartcard only
- Must install "webcard" plugin
- You need to "Smartcard reader"

## Support
- Safari 11
- IE 9+
- Firefox 51 (Not support newer version)
- Chrome 44 (Not support newer version)

## Getting Started
### Install dependencies
1. install package
```sh
npm install --save thai-smartcard-reader
```
2. Download and install ```webcard``` plugin [Mac](http://plugin.cardid.org/webcard.dmg) and [Windows](http://plugin.cardid.org/webcard.msi)
ref: [https://github.com/cardid/WebCard](https://github.com/cardid/WebCard)

### Include component
```js
import ThaiSmartcardReader from 'thai-smartcard-reader'
```
### Example
```javascript
<ThaiSmartcardReader onChange={(data) => console.log(data)} />
```
### Example response data
```json
{
  "citizenId": "1234567890123",
  "titleTH": "นาย",
  "firstnameTH": "ใจดี",
  "lastnameTH": "ดีใจ",
  "titleEN": "Mr.",
  "firstnameEN": "Jaidee",
  "lastnameEN": "Deejai",
  "birthday": "25600131",
  "gender": "1",
  "address": [
    "30/1",
    "หมู่ที่",
    "12",
    "ตำบลท้ายเมือง",
    "อำเภอท้ายบ้าน",
    "จังหวัดกระบี่กระบอง"
  ],
  "issueAll": "25570117",
  "expire": "25651231"
}
```

สุดท้าย...ผมตามหาคนช่วยแก้ README อยู่สนใจก็ pull request มาแล้วส่ง email มาให้ผมก็ได้ ผมไม่ค่อยเก่งภาษา