# react-native-json-schema-form
 React-Native component for building forms based on the JSON Schema.

## Accomplishments
 - renders the form with schema, uiSchema & formData
 - uniform styling of the components
 - Supported components [see list below](http://192.168.105.127/mobility/jsonschema-react-native-form/blob/master/README.md#component-list)
 - ajv validation
 - on form submit, form gets scrolled to the topmost error in the form.


## Roadmap
 - Support for structured & complex JSON schema includes $id, $ref, definitions, additional properties
 - Support for defaults
 - Better ajv error formulation for readable & understandable errors
 - Support for theme provider for the form components
 - Prop type declarations for all components
 - Unit tests
 
 
## Component list
[*Calculated](https://js.do/code/314698)


| **boolean** | | 
| ------ | ------ | 
| checkbox| CheckboxWidget| 
| radio| RadioWidget| 
| select| UnsupportedWidget| 
| hidden| UnsupportedWidget| 
| text| CheckboxWidget| 


| **string** | | 
| ------ | ------ | 
| text| TextWidget| 
| password| UnsupportedWidget| 
| email| UnsupportedWidget| 
| hostname| UnsupportedWidget| 
| ipv4| UnsupportedWidget| 
| ipv6| UnsupportedWidget| 
| uri| UnsupportedWidget| 
| data-url| UnsupportedWidget| 
| radio| RadioWidget| 
| select| DropDownWidget| 
| textarea| UnsupportedWidget| 
| hidden| UnsupportedWidget| 
| date| DateWidget| 
| datetime| UnsupportedWidget| 
| date-time| UnsupportedWidget| 
| alt-date| UnsupportedWidget| 
| alt-datetime| UnsupportedWidget| 
| color| UnsupportedWidget| 
| file| UnsupportedWidget| 


| **number** | | 
| ------ | ------ | 
| text| TextWidget| 
| select| UnsupportedWidget| 
| updown| UnsupportedWidget| 
| range| UnsupportedWidget| 
| radio| RadioWidget| 
| hidden| UnsupportedWidget| 


| **integer** | | 
| ------ | ------ | 
| text| TextWidget| 
| select| DropDownWidget| 
| updown| UnsupportedWidget| 
| range| SliderWidget| 
| radio| RadioWidget| 
| hidden| UnsupportedWidget| 
| checkboxes| CheckboxesWidget| 


| **array** | | 
| ------ | ------ | 
| select| UnsupportedWidget| 
| checkboxes| CheckboxesWidget| 
| files| UnsupportedWidget| 
