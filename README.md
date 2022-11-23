# CheckIt Js

## About This Project

CheckIt JS is a plain Javascript Laravel-like input validator with preserved rules and configuration such as required , nullable and many more.
All errors thoose created by the program when validating the input will be displayed in a form of floating card or you can use SweetAlert as the popup.
Also, you can use your custom HTML element that stands as replacement of default error popup

## Usage

CheckIt Js can be used by including the script in your HTML file. 
You can check the latest release and download it. You can embbed this tag inside your `<head>` tag or append before the `<body>` tag ends.
```html
<script src="checkit.js"></script>
```
You probably confused why there is `checkit.js` and `checkit.min.js.`
The word of min on `checkit.min.js` stands for minified version of `checkit.js`.
The `checkit.min.js` might has smaller file size but it can increasing CPU time to parse the code.  

### Initialization

First of all, you need the trigger to run the script (e.g. Button) inside the `<form>` or outside.  
Example if you use the button inside the `<form>`:  
```html
<form>
  <input type="text" id="name" name="name">
  <button id="check">Check</button>
</form>

<script>
  document.getElementById("check").addEventListener("click", function(e){
    e.preventDefault()
    checkIt({
      rules: {
        "name" : "required",
      }
    })
  })
</script>
```
Another Example if you use the button outside the form:  
```html
<form>
  <input type="text" id="name" name="name">
</form>

<button id="check">Check</button>

<script>
  document.getElementById("check").addEventListener("click", function(){
    checkIt({
      rules: {
        "name" : "required",
      }
    })
  })
</script>
```
### Basic Syntax

To use CheckIt Js as validator of your inputs, in this case you have an input with `id="name"` and you want to validate if the input is a text and a lowercase text.  
So you write the code as below:
```javascript
//don't forget the trigger
checkIt({
  rules: {
    "name" : "text|lowercase"
  }
})
```
Basicly, you write your input *id* as the key of *rules* object. The rules are the *property* of the object key (separated by *|*).  
So, the basic like this:
```javascript
//don't forget the trigger
checkIt({
  rules: {
    "your_input_id" : "rule1|rule2|so on.."
  }
})
```
You can see all supported rules [here](https://github.com/ardfar/CheckIt-JS#rules)

### Custom Error Message
If you want to define your own error message, you can follow this example:
```javascript
//don't forget the trigger
checkIt({
  rules: {
    "your_input_id" : "rule1|rule2|so on.."
  },
  message: {
    "your_input_id.rule1": "hello there",
    "your_input_id.rule2": "hi there",
  }
})
```
Just keep in your mind, every rules have their default error message. So, if you don't declare the error message, it'll use the default one.

### Customizing Error Popup
In this section, you'll learn about the error popup customization. Things are able to be customized:
- mode (default or swal)
- position
- HTML element

But, to customize all the above, we need to declare new variable as this one:
```javascript
//don't forget the trigger
checkIt({
  rules: {
    "your_input_id" : "rule1|rule2|so on.."
  },
  alert : {} //tells customization here
})
```

#### Mode Customization
There is two mode, First is `default` which use the CheckIt Js default popup and even if you don't declare it, `default` will be used as default. 
The second is `swal`.
`swal` means you tell the program to use `sweetalert (latest version)` to fire the popup error. 
If you declare `swal` but the `swal` doesn't exist, the default will be used.  
When you want to use sweetAlert:
```javascript
//don't forget the trigger
checkIt({
  rules: {
    "your_input_id" : "rule1|rule2|so on.."
  },
  alert : {
    mode: "swal"
  }
})
```

#### Position Customization
This customization only available if you use the `mode: "default"` which means that you don't need to declare the mode. 
The available position setting of popup position are:
- top-right => Top-Right corner of your screen
- top-center => Top of your screen but horizontally centered
- top-left => Top-Left corner of your screen
- center => horizontally and vertically centered 
- bottom-right => Bottom-Right corner of your screen
- bottom-center => Bottom of your screen but horizontally centered
- bottom-left => Bottom-Left corner of your screen

Example:
```javascript
//don't forget the trigger
checkIt({
  rules: {
    "your_input_id" : "rule1|rule2|so on.."
  },
  alert : {
    position: "center"
  }
})
```

#### User-Defined PopUp
You also can define your own HTML popup card by using `customAlert` inside the `alert` object. 
But, you need drop a placeholder to write the error by using `error_msg_placeholder` inside your HTML card also the style should be inlined.  
Example:
```javascript
checkIt({
  rules: {
    "your_input_id" : "rule1|rule2|so on.."
  },
  alert : {
    position: "center",
    customAlert: `
      <div title="click to dismiss" style="cursor: pointer;position:relative;width: 35vw;height: 60px;background: rgba(248,113,113,.1);border: 2px solid rgb(248,113,113); border-radius: 10px;margin-bottom: 10px;display: grid;grid-template-columns: 90% 10%;" onclick="this.style.display = 'none'">
        <div style="position: relative;width: 100%;padding: 10px;display: flex;align-items: center;">
          <p style="font-size: 18px;color: rgb(248,113,113);margin-inline: 0;margin-block: 0;height: fit-content;">           
            &#x26A0; error_msg_placeholder
          </p>
        </div>
        <div style="width: 100%;height: 100%;display: flex;align-items: center;justify-items: center;">
          <svg style="width: 25%;aspect-ratio: 1/1;fill: rgb(248,113,113)" ;version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 460.775 460.775" style="enable-background:new 0 0 460.775 460.775;" xml:space="preserve"> <path d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55 c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55 c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505 c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55 l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719 c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"/></svg>
        </div>
      </div>
    `
  }
})

```


## Rules

### `nullable`
The field under validation may be null.  

### `required`
The field under validation must be present in the input data and not empty. A field is considered "empty" if one of the following conditions are true:
- The value is `null`  
- The value is an empty string.

### `required_if:anotherfield,value`
The field under validation must be present and not empty if the anotherfield field is equal to any value.

### `required_unless:anotherfield,value`
The field under validation must be present and not empty unless the anotherfield field is equal to any value.

### `prohibited`
The field under validation must be an empty string or not present.

### `prohibited_if:anotherfield,value`
The field under validation must be an empty string or not present if the anotherfield field is equal to any value.

### `prohibited_unless:anotherfield,value`
The field under validation must be an empty string or not present unless the anotherfield field is equal to any value.

### `present`
The field under validation must be present in the input data but can be empty.

### `same`
The given field must match the field under validation.

### `regex:pattern`
The field under validation must match the given regular expression without any backslash '\' at the beginning and at the end of regular expression.
example:
```
"phone" : "regex:^(+)(62)"
```

### `not_regex:pattern`
The field under validation must not match the given regular expression without any backslash '\' at the beginning and at the end of regular expression.
example:
```
"phone" : "not_regex:^(+)(62)"
```

### `text`
The field under validation must be text or string. NaN

### `lowercase`
The field under validation must be lowercase.

### `uppercase`
The field under validation must be uppercase.

### `starts_with:foo,bar,...`
The field under validation must start with one of the given values.

### `ends_with:foo,bar,...`
The field under validation must end with one of the given values.

### `alpha`
The field under validation must be entirely alphabetic characters.

### `alpha_num`
The field under validation must be entirely alpha-numeric characters.

### `numeric`
The field under validation must be numeric.

### `integer`
The field under validation must be integer.

### `float`
The field under validation must be float or with decimal point.

### `boolean`
The field under validation must be 1 / 0 / true / false / yes / no.

### `url`
The field under validation must be a valid URL.

### `mac_address`
The field under validation must be a MAC address.

### `ip`
The field under validation must be a valid IP address.

### `ipv4`
The field under validation must be a valid IPv4 address.

### `ipv6`
The field under validation must be a valid IPv6 address.

### `email`
The field under validation must be formatted as an email address.

### `date:dateformat`
The field under validation must be a valid and non-relative date with certain format.  
Format that CheckIt Js understands are:
- Default = YYYY-MM-DD
- DD/MM/YYYY or DD-MM-YYYY
- MM/DD/YYYY or MM-DD-YYYY

### `date_equals:date`
The field under validation must be equal to the given date.

### `before:dateformat,date`
The field under validation with dateformat must be before the given date (with same format).

### `before_or_equal:dateformat`
The field under validation with dateformat must be before or equal to the given date (with same format).

### `after:dateformat,date`
The field under validation with dateformat must after the given date (with same format).

### `after_or_equal:dateformat`
The field under validation with dateformat must be after or equal to the given date (with same format).

### `min:value`
The field under validation must have a minimum value. String evaluated by it's length. Numeric evaluated by it's value. Files evaluated by their sizes.
Special for file, the size is evaluated in KiloBytes. Example `min:6000`, means files under the validation should have minimum size of 6000KB or 6MB 

### `min_digit:value`
The integer under validation must have a minimum length of value.

### `max:value`
The field under validation must have a maximum value. String evaluated by it's length. Numeric evaluated by it's value. Files evaluated by their sizes.
Special for file, the size is evaluated in KiloBytes. Example `max:6000`, means files under the validation should have maximum size of 6000KB or 6MB 

### `max_digit:value`
The integer under validation must have a maximum length of value.

### `multiple_of:value`
The field under validation must be a multiple of value. Example, if value of input equals to 50 and it's under the validation `multiple_of:5`,
the result will be `true`.
But, it will be `false` if the value is equal to 54

### `lt:value`
The field under validation must be lower than *value*. String evaluated by it's length. Numeric evaluated by it's value. Files evaluated by their sizes.

### `lte:value`
The field under validation must be equal or lower than *value*. String evaluated by it's length. Numeric evaluated by it's value. Files evaluated by their sizes.

### `gt:value`
The field under validation must be greater than *value*.  String evaluated by it's length. Numeric evaluated by it's value. Files evaluated by their sizes.

### `gte:value`
The field under validation must be equal or greater than *value*. String evaluated by it's length. Numeric evaluated by it's value. Files evaluated by their sizes.

### `between:min,max`
The field under validation must have a size between the given *min* and *max* (inclusive).
String evaluated by it's length. Numeric evaluated by it's value. Files evaluated by their sizes.

### `mimes:foo,bar,..`
The file under validation must have a MIME type corresponding to one of the listed extensions at
https://svn.apache.org/repos/asf/httpd/httpd/trunk/docs/conf/mime.types.  
example: 
```
"photo": "mimes:jpg,png,svg,dng"
```

## Callback
CheckIt JS have 3 types of callback. First, general callback that runs after all validations have been done even there is an error. 
Second, `if_valid` callback that runs if no error detected.
The last one, `if_error` callback that runs if error detected.  
Example of generic callback:
```javascript
//don't forget the trigger
checkIt({
  rules: {
    "your_input_id" : "rule1|rule2|so on.."
  },
  callback: function(){
    console.log("hello there")
  }
})
```
Example of `if_valid` and `if_error`:
```javascript
//don't forget the trigger
checkIt({
  rules: {
    "your_input_id" : "rule1|rule2|so on.."
  },
  callback: {
    if_valid: function(){
      console.log('hi,all good');
    },
    if_error: function(){
      console.log('hi, there is error')
    }
  }
})
```
 
## Further Development
Anyway, This version is Beta Version. So, i'll update this code as time goes by. Your feedbacks are so important to me to develop and update this script. 
Please give this project a star.

## License
This Project is under MIT License
