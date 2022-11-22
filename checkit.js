
function checkIt({rules,message={},alert={mode: 'default',position: 'top-right'},callback=function(){}}){
    // function declaration 
    function custom_msg_checker(id,rule,default_message,global_message){
        if (global_message[id + "." + rule] != null){
            return global_message[id + "." + rule]
        } else {
            default_message = id + " " + default_message
            return default_message
        }
    }

    let selector = Object.keys(rules);
    let error = [];
    selector.forEach(element => {
        let selector_id = element;
        let selector_value = document.getElementById(element).value;
        let rules_set = rules[element].split("|")
        if (!(rules_set.includes('present'))){
            selector_value = document.getElementById(element).value;
        }
        if ((rules_set.includes('required')) && (selector_value == '')){
            error.push(custom_msg_checker(selector_id,"required","should have some value",message));
        } else if ((rules_set.includes('prohibited')) && (selector_value != '')){
            error.push(custom_msg_checker(selector_id,"prohibited","should be empty",message));
        } else {
            rules_set.forEach(element => {
                let rule_detail = element.split(':');
                switch (rule_detail[0]) {
                    case 'same':
                        if (selector_value != document.getElementById(rule_detail[1]).value){
                            error.push(custom_msg_checker(selector_id,rule_detail[0],"should be same as " + rule_detail[1] + "'s value",message));
                        }
                        break;
                    case 'size':
                        if (document.getElementById(selector_id).type != 'file'){
                            if (selector_value.length != rule_detail[1]){
                                error.push(custom_msg_checker(selector_id,rule_detail[0],"should exactly " + rule_detail[1] + " characters long",message))
                            }
                        } else {
                            files = document.getElementById(selector_id).files;
                            console.log(files.length)
                            xac = 0
                            while (true){
                                if ((files[xac].size / 1000) != parseInt(rule_detail[1])){
                                    error.push(custom_msg_checker(selector_id,rule_detail[0],"should be " + rule_detail[1] + " KB",message))
                                    xac = 0;
                                    break;
                                }
                                xac++;
                            }
                        }
                        break;
                    case 'required_if':
                        required_data = rule_detail[1].split(',')
                        if ((document.getElementById(required_data[0]).value == (required_data[1]) && selector_value == "")){
                            error.push(custom_msg_checker(selector_id,rule_detail[0],"should not be empty",message));
                        }
                        break;
                    case 'required_unless':
                        required_data = rule_detail[1].split(',')
                        if ((!(document.getElementById(required_data[0]).value == (required_data[1])) && selector_value == "")){
                            error.push(custom_msg_checker(selector_id,rule_detail[0],"should not be empty",message));
                        }
                        break;
                    case 'prohibited_if':
                        prohibit_data = rule_detail[1].split(',')
                        if ((document.getElementById(prohibit_data[0]).value == (prohibit_data[1]) && selector_value != "")){
                            error.push(custom_msg_checker(selector_id,rule_detail[0],"should be empty",message));
                        }
                        break;
                    case 'prohibited_unless':
                        prohibit_data = rule_detail[1].split(',')
                        if (!(document.getElementById(prohibit_data[0]).value == (prohibit_data[1])) && (selector_value != "")){
                            error.push(custom_msg_checker(selector_id,rule_detail[0],"should be empty",message));
                        }
                        break;
                    case 'present':
                        if (!(document.getElementById(selector_id))){
                            error.push(custom_msg_checker(selector_id,rule_detail[0],"should be present in this page",message))
                        }
                        break;
                    case 'text':
                        if (!(isNaN(selector_value))){
                            error.push(custom_msg_checker(selector_id,rule_detail[0],"should be text",message));
                        }
                        break;
                    case 'alpha':
                        if (!(selector_value.match(/^[A-Za-z]+$/))){
                            error.push(custom_msg_checker(selector_id,rule_detail[0],"should only consist of alphabets",message));
                        }
                        break;
                    case 'alpha_num':
                        if (!(selector_value.match(/^[a-zA-Z0-9_]*$/))){
                            error.push(custom_msg_checker(selector_id,rule_detail[0],"should only consist of alphabets, numbers and underscores",message));
                        }
                        break;
                    case 'numeric':
                        if (!(isNaN(selector_value))){
                            error.push(custom_msg_checker(selector_id,rule_detail[0],"should be numeric",message));
                        }
                        break;
                    case 'multiple_of':
                        if (isNaN(selector_value)){
                            error.push(custom_msg_checker(selector_id,rule_detail[0],"should be numeric",message));
                        } else {
                            if ((selector_value % rule_detail[1]) != '0'){
                                error.push(custom_msg_checker(selector_id,rule_detail[0],"should be multiple of " + rule_detail[1],message));
                            }
                        }
                        break;
                    case 'integer':
                        if ((isNaN(selector_value)) && (parseInt(to_tested) != parseFloat(to_tested))){
                            error.push(custom_msg_checker(selector_id,rule_detail[0],"should be integer",message));
                        }
                        break;
                    case 'float':
                        if ((isNaN(selector_value)) && (parseInt(to_tested) == parseFloat(to_tested))){
                            error.push(custom_msg_checker(selector_id,rule_detail[0],"should be float or decimal",message));
                        }
                        break;
                    case 'boolean':
                        let bool_dict = ['true','false',1,0]
                        if (!(bool_dict.includes(selector_value.toLowerCase()))){
                            error.push(custom_msg_checker(selector_id,rule_detail[0],"should be boolean (true / false)",message));
                        }
                        break;
                    case 'max_digit':
                        if (!isNaN(selector_value)){
                            if (selector_value.length > parseInt(rule_detail[1])){
                                error.push(custom_msg_checker(selector_id,rule_detail[0],"should be less than " + rule_detail[1] + ((rule_detail[1] > 1) ? " digits" : " digit") ,message));
                            }
                        } else {
                            error.push(custom_msg_checker(selector_id,"max_digit_exception","should be integer",message));
                        }
                        break;
                    case 'min_digit':
                        if (!isNaN(selector_value)){
                            if (selector_value.length < parseInt(rule_detail[1])){
                                error.push(custom_msg_checker(selector_id,rule_detail[0],"should be longer than " + rule_detail[1] + ((rule_detail[1] > 1) ? " digits" : " digit") ,message));
                            }
                        } else {
                            error.push(custom_msg_checker(selector_id,"max_digit_exception","should be integer",message));
                        }
                        break;
                    case 'email':
                        let emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
                        if (!(emailReg.test(selector_value))){
                            error.push(custom_msg_checker(selector_id,rule_detail[0],"has no a valid email",message));
                        }
                        break;
                    case 'url':
                        if (!(selector_value.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g))){
                            error.push(custom_msg_checker(selector_id,rule_detail[0],"has no valid URL",message))
                        }
                        break;
                    case 'mac_address':
                        if (!(selector_value.match(/^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/))){
                            error.push(custom_msg_checker(selector_id,rule_detail[0],"has no valid MAC Address",message))
                        }
                        break;
                    case 'ipv4':
                        if (!(selector_value.match(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/))){
                            error.push(custom_msg_checker(selector_id,rule_detail[0],"value is not an IPv4 address",message));
                        }
                        break;
                    case 'ipv6':
                        if (!(selector_value.match(/^(?:(?:[a-fA-F\d]{1,4}:){7}(?:[a-fA-F\d]{1,4}|:)|(?:[a-fA-F\d]{1,4}:){6}(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|:[a-fA-F\d]{1,4}|:)|(?:[a-fA-F\d]{1,4}:){5}(?::(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,2}|:)|(?:[a-fA-F\d]{1,4}:){4}(?:(?::[a-fA-F\d]{1,4}){0,1}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,3}|:)|(?:[a-fA-F\d]{1,4}:){3}(?:(?::[a-fA-F\d]{1,4}){0,2}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,4}|:)|(?:[a-fA-F\d]{1,4}:){2}(?:(?::[a-fA-F\d]{1,4}){0,3}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,5}|:)|(?:[a-fA-F\d]{1,4}:){1}(?:(?::[a-fA-F\d]{1,4}){0,4}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,6}|:)|(?::(?:(?::[a-fA-F\d]{1,4}){0,5}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,7}|:)))(?:%[0-9a-zA-Z]{1,})?$/))){
                            error.push(custom_msg_checker(selector_id,rule_detail[0],"value is not an IPv6 address",message));
                        }
                        break
                    case 'ip':
                        if (!(selector_value.match(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/)) && !(selector_value.match(/^(?:(?:[a-fA-F\d]{1,4}:){7}(?:[a-fA-F\d]{1,4}|:)|(?:[a-fA-F\d]{1,4}:){6}(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|:[a-fA-F\d]{1,4}|:)|(?:[a-fA-F\d]{1,4}:){5}(?::(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,2}|:)|(?:[a-fA-F\d]{1,4}:){4}(?:(?::[a-fA-F\d]{1,4}){0,1}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,3}|:)|(?:[a-fA-F\d]{1,4}:){3}(?:(?::[a-fA-F\d]{1,4}){0,2}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,4}|:)|(?:[a-fA-F\d]{1,4}:){2}(?:(?::[a-fA-F\d]{1,4}){0,3}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,5}|:)|(?:[a-fA-F\d]{1,4}:){1}(?:(?::[a-fA-F\d]{1,4}){0,4}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,6}|:)|(?::(?:(?::[a-fA-F\d]{1,4}){0,5}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-fA-F\d]{1,4}){1,7}|:)))(?:%[0-9a-zA-Z]{1,})?$/))){
                            error.push(custom_msg_checker(selector_id,rule_detail[0],"value is not an IP address",message));
                        }
                        break;
                    case 'date':
                        switch (rule_detail[1]) {
                            case 'DD/MM/YYYY':
                                if (!(selector_value.match(/(^(((0[1-9]|1[0-9]|2[0-8])((\/)|(-))(0[1-9]|1[012]))|((29|30|31)((\/)|(-))(0[13578]|1[02]))|((29|30)((\/)|(-))(0[4,6,9]|11)))((\/)|(-))(19|[2-9][0-9])\d\d$)|(^29((\/)|(-))02((\/)|(-))(19|[2-9][0-9])(00|04|08|12|16|20|24|28|32|36|40|44|48|52|56|60|64|68|72|76|80|84|88|92|96)$)/))){
                                    error.push(custom_msg_checker(selector_id,rule_detail[0],"value is not valid date (DD/MM/YYYY)",message))
                                }
                                break;
                            case 'MM/DD/YYYY':
                                if (!(selector_value.match(/^(0[1-9]|1[0-2])((\/)|(-))(0[1-9]|1\d|2\d|3[01])((\/)|(-))(19|20)\d{2}$/))){
                                    error.push(custom_msg_checker(selector_id,rule_detail[0],"value is not valid date (MM/DD/YYYY)",message))
                                }
                                break;
                            default:
                                if (!(selector_value.match(/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/))){
                                    error.push(custom_msg_checker(selector_id,rule_detail[0],"value is not valid date (on default browser format)",{})) 
                                    break;
                                }
                        }
                        break;
                    case 'before':
                        date_detail = rule_detail[1].split(',');
                        if ((date_detail[0] == 'DD/MM/YYYY') || (date_detail[0] == 'MM/DD/YYYY')){
                            if ((date_detail[0] == 'DD/MM/YYYY') && !(selector_value.match(/(^(((0[1-9]|1[0-9]|2[0-8])((\/)|(-))(0[1-9]|1[012]))|((29|30|31)((\/)|(-))(0[13578]|1[02]))|((29|30)((\/)|(-))(0[4,6,9]|11)))((\/)|(-))(19|[2-9][0-9])\d\d$)|(^29((\/)|(-))02((\/)|(-))(19|[2-9][0-9])(00|04|08|12|16|20|24|28|32|36|40|44|48|52|56|60|64|68|72|76|80|84|88|92|96)$)/))){
                                error.push(custom_msg_checker(selector_id,rule_detail[0],"value is not valid date (DD/MM/YYYY)",{})) 
                                break;
                            }
                            if ((date_detail[0] == 'MM/DD/YYYY') && !(selector_value.match(/^(0[1-9]|1[0-2])((\/)|(-))(0[1-9]|1\d|2\d|3[01])((\/)|(-))(19|20)\d{2}$/))){
                                error.push(custom_msg_checker(selector_id,rule_detail[0],"value is not valid date (MM/DD/YYYY)",{})) 
                                break;
                            }
                        } else {
                            if (!(selector_value.match(/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/))){
                                error.push(custom_msg_checker(selector_id,rule_detail[0],"value is not valid date (on default browser format)",{})) 
                                break;
                            }
                        }
                        if ((selector_value.match(/(^(((0[1-9]|1[0-9]|2[0-8])((\/)|(-))(0[1-9]|1[012]))|((29|30|31)((\/)|(-))(0[13578]|1[02]))|((29|30)((\/)|(-))(0[4,6,9]|11)))((\/)|(-))(19|[2-9][0-9])\d\d$)|(^29((\/)|(-))02((\/)|(-))(19|[2-9][0-9])(00|04|08|12|16|20|24|28|32|36|40|44|48|52|56|60|64|68|72|76|80|84|88|92|96)$)/)) || (selector_value.match(/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/))){
                            let temp = selector_value.split('/');
                            str_time = [temp[1],temp[0],temp[2]].join('/');
                        } else {
                            str_time = selector_value;
                        }
                        before_date = Date.parse(date_detail[1])
                        if (Date.parse(str_time) >= before_date){
                            error.push(custom_msg_checker(selector_id,rule_detail[0],"should be before date " + date_detail[1],message))
                        }
                        break;
                    case 'before_or_equal':
                        date_detail = rule_detail[1].split(',');
                        if ((date_detail[0] == 'DD/MM/YYYY') || (date_detail[0] == 'MM/DD/YYYY')){
                            if ((date_detail[0] == 'DD/MM/YYYY') && !(selector_value.match(/(^(((0[1-9]|1[0-9]|2[0-8])((\/)|(-))(0[1-9]|1[012]))|((29|30|31)((\/)|(-))(0[13578]|1[02]))|((29|30)((\/)|(-))(0[4,6,9]|11)))((\/)|(-))(19|[2-9][0-9])\d\d$)|(^29((\/)|(-))02((\/)|(-))(19|[2-9][0-9])(00|04|08|12|16|20|24|28|32|36|40|44|48|52|56|60|64|68|72|76|80|84|88|92|96)$)/))){
                                error.push(custom_msg_checker(selector_id,rule_detail[0],"value is not valid date (DD/MM/YYYY)",{})) 
                                break;
                            }
                            if ((date_detail[0] == 'MM/DD/YYYY') && !(selector_value.match(/^(0[1-9]|1[0-2])((\/)|(-))(0[1-9]|1\d|2\d|3[01])((\/)|(-))(19|20)\d{2}$/))){
                                error.push(custom_msg_checker(selector_id,rule_detail[0],"value is not valid date (MM/DD/YYYY)",{})) 
                                break;
                            }
                        } else {
                            if (!(selector_value.match(/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/))){
                                error.push(custom_msg_checker(selector_id,rule_detail[0],"value is not valid date (on default browser format)",{})) 
                                break;
                            }
                        }
                        if ((selector_value.match(/(^(((0[1-9]|1[0-9]|2[0-8])((\/)|(-))(0[1-9]|1[012]))|((29|30|31)((\/)|(-))(0[13578]|1[02]))|((29|30)((\/)|(-))(0[4,6,9]|11)))((\/)|(-))(19|[2-9][0-9])\d\d$)|(^29((\/)|(-))02((\/)|(-))(19|[2-9][0-9])(00|04|08|12|16|20|24|28|32|36|40|44|48|52|56|60|64|68|72|76|80|84|88|92|96)$)/)) || (selector_value.match(/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/))){
                            let temp = selector_value.split('/');
                            str_time = [temp[1],temp[0],temp[2]].join('/');
                        } else {
                            str_time = selector_value;
                        }
                        before_date = Date.parse(date_detail[1])
                        if (Date.parse(str_time) > before_date){
                            error.push(custom_msg_checker(selector_id,rule_detail[0],"should be before or equal to date " + date_detail[1],message))
                        }
                        break;
                    case 'after':
                        date_detail = rule_detail[1].split(',');
                        if ((date_detail[0] == 'DD/MM/YYYY') || (date_detail[0] == 'MM/DD/YYYY')){
                            if ((date_detail[0] == 'DD/MM/YYYY') && !(selector_value.match(/(^(((0[1-9]|1[0-9]|2[0-8])((\/)|(-))(0[1-9]|1[012]))|((29|30|31)((\/)|(-))(0[13578]|1[02]))|((29|30)((\/)|(-))(0[4,6,9]|11)))((\/)|(-))(19|[2-9][0-9])\d\d$)|(^29((\/)|(-))02((\/)|(-))(19|[2-9][0-9])(00|04|08|12|16|20|24|28|32|36|40|44|48|52|56|60|64|68|72|76|80|84|88|92|96)$)/))){
                                error.push(custom_msg_checker(selector_id,rule_detail[0],"value is not valid date (DD/MM/YYYY)",{})) 
                                break;
                            }
                            if ((date_detail[0] == 'MM/DD/YYYY') && !(selector_value.match(/^(0[1-9]|1[0-2])((\/)|(-))(0[1-9]|1\d|2\d|3[01])((\/)|(-))(19|20)\d{2}$/))){
                                error.push(custom_msg_checker(selector_id,rule_detail[0],"value is not valid date (MM/DD/YYYY)",{})) 
                                break;
                            }
                        } else {
                            if (!(selector_value.match(/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/))){
                                error.push(custom_msg_checker(selector_id,rule_detail[0],"value is not valid date (on default browser format)",{})) 
                                break;
                            }
                        }
                        if ((selector_value.match(/(^(((0[1-9]|1[0-9]|2[0-8])((\/)|(-))(0[1-9]|1[012]))|((29|30|31)((\/)|(-))(0[13578]|1[02]))|((29|30)((\/)|(-))(0[4,6,9]|11)))((\/)|(-))(19|[2-9][0-9])\d\d$)|(^29((\/)|(-))02((\/)|(-))(19|[2-9][0-9])(00|04|08|12|16|20|24|28|32|36|40|44|48|52|56|60|64|68|72|76|80|84|88|92|96)$)/)) || (selector_value.match(/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/))){
                            let temp = selector_value.split('/');
                            str_time = [temp[1],temp[0],temp[2]].join('/');
                        } else {
                            str_time = selector_value;
                        }
                        before_date = Date.parse(date_detail[1])
                        if (Date.parse(str_time) >= before_date){
                            error.push(custom_msg_checker(selector_id,rule_detail[0],"should be after date " + date_detail[1],message))
                        }
                        break;
                    case 'after_or_equal':
                        date_detail = rule_detail[1].split(',');
                        if ((date_detail[0] == 'DD/MM/YYYY') || (date_detail[0] == 'MM/DD/YYYY')){
                            if ((date_detail[0] == 'DD/MM/YYYY') && !(selector_value.match(/(^(((0[1-9]|1[0-9]|2[0-8])((\/)|(-))(0[1-9]|1[012]))|((29|30|31)((\/)|(-))(0[13578]|1[02]))|((29|30)((\/)|(-))(0[4,6,9]|11)))((\/)|(-))(19|[2-9][0-9])\d\d$)|(^29((\/)|(-))02((\/)|(-))(19|[2-9][0-9])(00|04|08|12|16|20|24|28|32|36|40|44|48|52|56|60|64|68|72|76|80|84|88|92|96)$)/))){
                                error.push(custom_msg_checker(selector_id,rule_detail[0],"value is not valid date (DD/MM/YYYY)",{})) 
                                break;
                            }
                            if ((date_detail[0] == 'MM/DD/YYYY') && !(selector_value.match(/^(0[1-9]|1[0-2])((\/)|(-))(0[1-9]|1\d|2\d|3[01])((\/)|(-))(19|20)\d{2}$/))){
                                error.push(custom_msg_checker(selector_id,rule_detail[0],"value is not valid date (MM/DD/YYYY)",{})) 
                                break;
                            }
                        } else {
                            if (!(selector_value.match(/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/))){
                                error.push(custom_msg_checker(selector_id,rule_detail[0],"value is not valid date (on default browser format)",{})) 
                                break;
                            }
                        }
                        if ((selector_value.match(/(^(((0[1-9]|1[0-9]|2[0-8])((\/)|(-))(0[1-9]|1[012]))|((29|30|31)((\/)|(-))(0[13578]|1[02]))|((29|30)((\/)|(-))(0[4,6,9]|11)))((\/)|(-))(19|[2-9][0-9])\d\d$)|(^29((\/)|(-))02((\/)|(-))(19|[2-9][0-9])(00|04|08|12|16|20|24|28|32|36|40|44|48|52|56|60|64|68|72|76|80|84|88|92|96)$)/)) || (selector_value.match(/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/))){
                            let temp = selector_value.split('/');
                            str_time = [temp[1],temp[0],temp[2]].join('/');
                        } else {
                            str_time = selector_value;
                        }
                        before_date = Date.parse(date_detail[1])
                        if (Date.parse(str_time) > before_date){
                            error.push(custom_msg_checker(selector_id,rule_detail[0],"should be after or equal to date " + date_detail[1],message))
                        }
                        break;
                    case 'date_equals':
                        date_detail = rule_detail[1].split(',');
                        if ((date_detail[0] == 'DD/MM/YYYY') || (date_detail[0] == 'MM/DD/YYYY')){
                            if ((date_detail[0] == 'DD/MM/YYYY') && !(selector_value.match(/(^(((0[1-9]|1[0-9]|2[0-8])((\/)|(-))(0[1-9]|1[012]))|((29|30|31)((\/)|(-))(0[13578]|1[02]))|((29|30)((\/)|(-))(0[4,6,9]|11)))((\/)|(-))(19|[2-9][0-9])\d\d$)|(^29((\/)|(-))02((\/)|(-))(19|[2-9][0-9])(00|04|08|12|16|20|24|28|32|36|40|44|48|52|56|60|64|68|72|76|80|84|88|92|96)$)/))){
                                error.push(custom_msg_checker(selector_id,rule_detail[0],"value is not valid date (DD/MM/YYYY)",{})) 
                                break;
                            }
                            if ((date_detail[0] == 'MM/DD/YYYY') && !(selector_value.match(/^(0[1-9]|1[0-2])((\/)|(-))(0[1-9]|1\d|2\d|3[01])((\/)|(-))(19|20)\d{2}$/))){
                                error.push(custom_msg_checker(selector_id,rule_detail[0],"value is not valid date (MM/DD/YYYY)",{})) 
                                break;
                            }
                        } else {
                            if (!(selector_value.match(/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/))){
                                error.push(custom_msg_checker(selector_id,rule_detail[0],"value is not valid date (on default browser format)",{})) 
                                break;
                            }
                        }
                        if ((selector_value.match(/(^(((0[1-9]|1[0-9]|2[0-8])((\/)|(-))(0[1-9]|1[012]))|((29|30|31)((\/)|(-))(0[13578]|1[02]))|((29|30)((\/)|(-))(0[4,6,9]|11)))((\/)|(-))(19|[2-9][0-9])\d\d$)|(^29((\/)|(-))02((\/)|(-))(19|[2-9][0-9])(00|04|08|12|16|20|24|28|32|36|40|44|48|52|56|60|64|68|72|76|80|84|88|92|96)$)/)) || (selector_value.match(/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/))){
                            let temp = selector_value.split('/');
                            str_time = [temp[1],temp[0],temp[2]].join('/');
                        } else {
                            str_time = selector_value;
                        }
                        before_date = Date.parse(date_detail[1])
                        if (Date.parse(str_time) != before_date){
                            error.push(custom_msg_checker(selector_id,rule_detail[0],"should be equal to date " + date_detail[1],message))
                        }
                        break;
                    case 'min':
                        // rule_detail[1] = min value 
                        if (document.getElementById(selector_id).type != 'file'){
                            if (isNaN(selector_value)){
                                if (selector_value.length < rule_detail[1]){
                                    error.push(custom_msg_checker(selector_id,rule_detail[0],"length should greater than " + rule_detail[1] + ((rule_detail[1] > 1) ? " characters" : " character"),message));
                                }
                            } else {
                                if (parseFloat(selector_value) < rule_detail[1]){
                                    error.push(custom_msg_checker(selector_id,rule_detail[0],"should greater than " + rule_detail[1],message));
                                }
                            }
                        } else {
                            files = document.getElementById(selector_id).files;
                            console.log(files.length)
                            xac = 0
                            while (true){
                                if (xac != files.length){
                                    file_size = files[xac].size;
                                    if ((file_size / 1000) < parseInt(rule_detail[1])){
                                        error.push(custom_msg_checker(selector_id,rule_detail[0],"should be larger than " + rule_detail[1] + " KB",message))
                                        xac = 0;
                                        break;
                                    }
                                    xac++;
                                } else {
                                    break;
                                }
                            }
                        }
                        break;
                    case 'max':
                        // rule_detail[1] = max value 
                        if (document.getElementById(selector_id).type != 'file'){
                            if (isNaN(selector_value)){
                                if (selector_value.length > rule_detail[1]){
                                    error.push(custom_msg_checker(selector_id,rule_detail[0],"length should lower than " + rule_detail[1] + ((rule_detail[1] > 1) ? " characters" : " character"),message));
                                }
                            } else {
                                if (parseFloat(selector_value) > rule_detail[1]){
                                    error.push(custom_msg_checker(selector_id,rule_detail[0],"should lower than " + rule_detail[1],message));
                                }
                            }
                        } else {
                            files = document.getElementById(selector_id).files;
                            console.log(files.length)
                            xac = 0
                            while (true){
                                if (xac != files.length){
                                    file_size = files[xac].size;
                                    if ((file_size / 1000) > parseInt(rule_detail[1])){
                                        error.push(custom_msg_checker(selector_id,rule_detail[0],"should be smaller than " + rule_detail[1] + " KB",message))
                                        xac = 0;
                                        break;
                                    }
                                    xac++;
                                } else {
                                    break;
                                }
                            }
                        }
                        break;
                    case 'between': 
                        let point = rule_detail[1].split(',')
                        if (document.getElementById(selector_id).type != 'file'){
                            if (isNaN(selector_value)){
                                if (!(selector_value.length >= point[0]) && (selector_value.length <= point[1])){
                                    error.push(custom_msg_checker(selector_id,rule_detail[0],"length should be between " + point[0] + " and " + point[1] + " " + ((rule_detail[1] > 1) ? " characters" : " character"),message));
                                }
                            } else {
                                if (!(parseFloat(selector_value) >= point[0]) && (parseFloat(selector_value) <= point[1])){
                                    error.push(custom_msg_checker(selector_id,rule_detail[0],"should be between " + point[0] + " and " + point[1],message));
                                }
                            }
                        } else {
                            files = document.getElementById(selector_id).files;
                            console.log(files.length)
                            xac = 0
                            while (true){
                                if (xac != files.length){
                                    file_size = files[xac].size;
                                    if (!(((file_size / 1000) >= parseInt(point[0])) && ((file_size / 1000) <= parseInt(point[1])))){
                                        error.push(custom_msg_checker(selector_id,rule_detail[0],"should be between " + point[0] + " KB and " + point[1] + " KB",message))
                                        xac = 0;
                                        break;
                                    }
                                    xac++;
                                } else {
                                    break;
                                }
                            }
                        }
                        break;
                    case 'gt':
                        // rule_detail[1] = min value to be passed (!=)
                        if(document.getElementById(selector_id).type != 'file'){
                            if (isNaN(selector_value)){
                                if (selector_value.length <= rule_detail[1]){
                                    error.push(custom_msg_checker(selector_id,rule_detail[0],"length should greater than " + rule_detail[1] + ((rule_detail[1] > 1) ? " characters" : " character"),message));
                                }
                            } else {
                                if (parseFloat(selector_value) <= point[1]){
                                    error.push(custom_msg_checker(selector_id,rule_detail[0],"should greater than " + rule_detail[1],message));
                                }
                            }
                        } else {
                            files = document.getElementById(selector_id).files;
                            console.log(files.length)
                            xac = 0
                            while (true){
                                if (xac != files.length){
                                    file_size = files[xac].size;
                                    if ((file_size / 1000) <= parseInt(rule_detail[1])){
                                        error.push(custom_msg_checker(selector_id,rule_detail[0],"should be larger than " + rule_detail[1] + " KB",message))
                                        xac = 0;
                                        break;
                                    }
                                    xac++;
                                } else {
                                    break;
                                }
                            }
                        }
                        break;
                    case 'gte':
                        // rule_detail[1] = min value to be passed (!=)
                        if (document.getElementById(selector_id).type != 'file'){
                            if (isNaN(selector_value)){
                                if (selector_value.length < rule_detail[1]){
                                    error.push(custom_msg_checker(selector_id,rule_detail[0],"length should greater than or equal " + rule_detail[1] + ((rule_detail[1] > 1) ? " characters" : " character"),message));
                                }
                            } else {
                                if (parseFloat(selector_value) < point[1]){
                                    error.push(custom_msg_checker(selector_id,rule_detail[0],"should greater than or equal " + rule_detail[1],message));
                                }
                            }
                        } else {
                            files = document.getElementById(selector_id).files;
                            console.log(files.length)
                            xac = 0
                            while (true){
                                if (xac != files.length){
                                    file_size = files[xac].size;
                                    if ((file_size / 1000) < parseInt(rule_detail[1])){
                                        error.push(custom_msg_checker(selector_id,rule_detail[0],"should be larger than or equal " + rule_detail[1] + " KB",message))
                                        xac = 0;
                                        break;
                                    }
                                    xac++;
                                } else {
                                    break;
                                }
                            }
                        }
                        break;
                    case 'lt':
                        // rule_detail[1] = min value to be passed (!=)
                        if (document.getElementById(selector_id).type != 'file'){
                            if (isNaN(selector_value)){
                                if (selector_value.length >= rule_detail[1]){
                                    error.push(custom_msg_checker(selector_id,rule_detail[0],"length should lower than " + rule_detail[1] + ((rule_detail[1] > 1) ? " characters" : " character"),message));
                                }
                            } else {
                                if (parseFloat(selector_value) >= point[1]){
                                    error.push(custom_msg_checker(selector_id,rule_detail[0],"should lower than " + rule_detail[1],message));
                                }
                            }
                        } else {
                            files = document.getElementById(selector_id).files;
                            console.log(files.length)
                            xac = 0
                            while (true){
                                if (xac != files.length){
                                    file_size = files[xac].size;
                                    if ((file_size / 1000) >= parseInt(rule_detail[1])){
                                        error.push(custom_msg_checker(selector_id,rule_detail[0],"should be smaller than " + rule_detail[1] + " KB",message))
                                        xac = 0;
                                        break;
                                    }
                                    xac++;
                                } else {
                                    break;
                                }
                            }
                        }
                        break;
                    case 'lte':
                        // rule_detail[1] = min value to be passed (!=)
                        if (document.getElementById(selector_id).type != 'file'){
                            if (isNaN(selector_value)){
                                if (selector_value.length > rule_detail[1]){
                                    error.push(custom_msg_checker(selector_id,rule_detail[0],"length should lower than or equal " + rule_detail[1] + ((rule_detail[1] > 1) ? " characters" : " character"),message));
                                }
                            } else {
                                if (parseFloat(selector_value) > point[1]){
                                    error.push(custom_msg_checker(selector_id,rule_detail[0],"should lower than or equal " + rule_detail[1],message));
                                }
                            }
                        } else {
                            files = document.getElementById(selector_id).files;
                            console.log(files.length)
                            xac = 0
                            while (true){
                                if (xac != files.length){
                                    file_size = files[xac].size;
                                    if ((file_size / 1000) > parseInt(rule_detail[1])){
                                        error.push(custom_msg_checker(selector_id,rule_detail[0],"should be smaller than or equal " + rule_detail[1] + " KB",message))
                                        xac = 0;
                                        break;
                                    }
                                    xac++;
                                } else {
                                    break;
                                }
                            }
                        }
                        break;
                    case 'starts_with':
                        const_check = rule_detail[1].split(",");
                        result = false;
                        const_check.forEach(element => {
                            if (selector_value.indexOf(element) == 0){
                                result = true
                            }
                        });
                        if (!result){
                            error.push(custom_msg_checker(selector_id,rule_detail[0],"should starts with " + rule_detail[1].replaceAll(","," or "),message));
                        }
                        break;
                    case 'ends_with':
                        const_check = rule_detail[1].split(",");
                        result = false;
                        const_check.forEach(element => {
                            if ((selector_value.indexOf(element) == (selector_value.length - element.length ))){
                                result = true
                            }
                        });
                        if (!result){
                            error.push(custom_msg_checker(selector_id,rule_detail[0],"should ends with " + rule_detail[1].replaceAll(","," or "),message));
                        }
                        break;
                    case 'mimes':
                        if (document.getElementById(selector_id).getAttribute('type') != 'file'){
                            error.push(selector_id + " should be file input")
                        } else {
                            let mime = rule_detail[1].split(',');
                            result = false
                            mime.forEach(element => {
                                if (selector_value.includes("." + element)){
                                    result = true;
                                }
                            });
                            if (!result){
                                error.push(custom_msg_checker(selector_id,rule_detail[0],"should be in " + rule_detail[1].replaceAll(","," or ") + " format",message));
                            } 
                        }
                        break;
                    case 'regex':
                        regExp_container = new RegExp(rule_detail[1])
                        if (!(selector_value.match(regExp_container))){
                            error.push(custom_msg_checker(selector_id,rule_detail[0],"doesn't match regex " + rule_detail[1],message))
                        }
                        break;
                    case 'not_regex':
                        regExp_container = new RegExp(rule_detail[1])
                        if (selector_value.match(regExp_container)){
                            error.push(custom_msg_checker(selector_id,rule_detail[0],"should not match regex " + rule_detail[1],message))
                        }
                        break;
                    case 'lowercase':
                        if (selector_value != selector_value.toLowerCase()){
                            error.push(custom_msg_checker(selector_id,rule_detail[0],"should be lowercase text",message))
                        }
                        break;
                    case 'uppercase':
                        if (selector_value != selector_value.toUpperCase()){
                            error.push(custom_msg_checker(selector_id,rule_detail[0],"should be uppercase text",message))
                        }
                    default:
                        if (!(["nullable","required","prohibited"].includes(rule_detail[0]))){
                            console.log(rule_detail[0] + " is wrong Rule for " + selector_id);
                        }
                        break;
                }
            })
        }
    });
    if (error.length > 0){
        // error pop declaration 
        function error_pop(){
            error.forEach(element => {
                bodyMain = document.querySelector('body')
                if (typeof alert['position'] == 'undefined'){
                    err_pos = "top: 10px;right: 20px;"
                } else {
                    switch (alert['position']){
                        case 'top-center': 
                            err_pos = "top: 10px;left: 50%; transform: translateX(-50%);"
                            break;
                        case 'top-left': 
                            err_pos = "top: 10px;left: 20px;"
                            break;
                        case 'bottom-right': 
                            err_pos = "bottom: 10px;right: 20px;"
                            break;
                        case 'bottom-center':
                            err_pos = "bottom: 10px;left: 50%; transform: translateX(-50%);"
                            break;
                        case 'bottom-left':
                            err_pos = "bottom: 10px;left: 20px;"
                            break;
                        case 'center':
                            err_pos = "top: 50%;left: 50%; transform: translate(-50%,-50%);"
                            break;
                        default:
                            err_pos = "top: 10px;right: 20px;"
                            break;
                    }
                }
                if (!(document.getElementById("error_pop_container"))){
                    error_container = document.createElement('div')
                    error_container.id = "error_pop_container"
                    error_container.style = "position: absolute;width: fit-content;height: fit-content;" + err_pos;
                    bodyMain.appendChild(error_container)
                } else {
                    error_container = document.getElementById('error_pop_container')
                }
                if (typeof alert['customAlert'] == 'undefined'){
                    error_pop = `
                        <div title="click to dismiss" style="cursor: pointer;position:relative;width: 35vw;height: 60px;background: rgba(248,113,113,.1);border: 2px solid rgb(248,113,113); border-radius: 10px;margin-bottom: 10px;display: grid;grid-template-columns: 90% 10%;" onclick="this.style.display = 'none'">
                            <div style="position: relative;width: 100%;padding: 10px;display: flex;align-items: center;">
                                <p style="font-size: 18px;color: rgb(248,113,113);margin-inline: 0;margin-block: 0;height: fit-content;">           
                                &#x26A0; ` + element + `
                                </p>
                            </div>
                            <div style="width: 100%;height: 100%;display: flex;align-items: center;justify-items: center;">
                                <svg style="width: 25%;aspect-ratio: 1/1;fill: rgb(248,113,113)" ;version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 460.775 460.775" style="enable-background:new 0 0 460.775 460.775;" xml:space="preserve"> <path d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55 c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55 c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505 c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55 l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719 c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"/></svg>
                            </div>
                        </div>
                    `
                } else {
                    error_pop = customAlert.replace('error_msg_placeholder',element);
                }
                error_container.innerHTML += error_pop;
            });
        }
        if (typeof alert['mode'] == 'undefined'){
            error_pop()
        } else {
            if ((alert['mode'].toLowerCase() == 'swal') && (typeof Swal == "function")){
                let temp_err = "";
                error.forEach(element => {
                    temp_err += element + "<br>"
                })
                Swal.fire({
                    title:"Oops!",
                    html: temp_err,
                    icon:"error",
                    showDenyButton:!0,
                    showConfirmButton:!1,
                    denyButtonText:"Return",
                    buttons:!0,
                    dangerMode:!0
                })
            } else {
                // if swal dont detected 
                error_pop()
            }
        }
        
    }
    if (typeof callback == 'function'){
        callback();
    }
    if (typeof callback == 'object'){
        if ((typeof callback['if_valid'] == 'function') && (error.length == 0)){
            callback['if_valid']()
        }
        if ((typeof callback['if_error'] == 'function') && (error.length != 0)){
            callback['if_error']();
        }
    }
}