import * as React from 'react';
import { connect } from 'react-redux'
import { Link, Redirect } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { createJWT } from "../utils/jwt-generator";
import { sendEmail, mail } from "../utils/sendGrid"

import {
  Container,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  FormText,
  FormFeedback,
} from 'reactstrap';
import '../style/CreateNewCertificate.css';

type CreateNewSettingsState = {
  entityEmailAddress: string,
  categorySetting: string,
  defaultEmailTemplateTitle: string,
  validate: { emailState: string },
  errorMessage: string,
  promptMessage: string,
  submitted: boolean,
}

type SettingsProps = {
  allCategories: [string] | null,
  allEntityEmailAddresses: [string] | null,
  allCustomEmailTemplates: [EmailTemplateState] | null,
  currentDefaultEmailTemplate: EmailTemplateState | null,
  currentAgent: { agent: { Hash: Hash, Name: string } },
  fetchAgent: () => void,

  genCategory: (category) => void,
  fetchCategories: () => void,

  genEntityEmailAddress: (emailAddress) => void
  fetchEntityEmailAddresses: () => void

  genCustomEmailTemplate: (defaultEmail: {header, body}) => void,
  fetchCustomEmailTemplates: () => void,

  setDefaultEmail: (defaultEmail: {header, body}) => void,
  fetchDefaultEmail: () => Promise<any>,
}

let defaultEmailDefaultWording = "<p>Thank you for joining our and supporting the Holo Community. Please copy the Holo Fuel Digital Certificate ID below and visit the Holo Fuel Certificate Manager to view your certificate.</p>";
// let customEmaildefaultWording = "<p>Type in your email message here. Don't forget to thank our community for their support! :)</p>";

let defaultEmailTemplate:string =  defaultEmailDefaultWording;
// let newCustomEmailTemplate:string = customEmaildefaultWording;

export default class CreateNewSettings extends React.Component<SettingsProps, CreateNewSettingsState>  {
  getDerivedStateFromProps(props, state) {
    const { currentDefaultEmailTemplate } = props;
    if (currentDefaultEmailTemplate === undefined || currentDefaultEmailTemplate === null) {
      return {...state};
    }
    else {
      if(state.defaultEmailTemplateTitle !== props.currentDefaultEmailTemplate!.header){
        return {...state}
      }else{
        defaultEmailDefaultWording =  props.currentDefaultEmailTemplate!.body;
        defaultEmailTemplate =  props.currentDefaultEmailTemplate!.body;
        return ({
          ...state,
          defaultEmailTemplateTitle: props.currentDefaultEmailTemplate!.header
        })
      }
    }
}

  constructor(props: any) {
    super(props);
    this.state = {
      entityEmailAddress: "",
      categorySetting: "",
      defaultEmailTemplateTitle: "",
      validate: { emailState: "" },
      errorMessage: "",
      promptMessage: "",
      submitted: false,
    }
    this.validateEmail = this.validateEmail.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.createEntityEmail = this.createEntityEmail.bind(this);
    this.createCategorySettings = this.createCategorySettings.bind(this);
    this.createDefaultEmailTemplate = this.createDefaultEmailTemplate.bind(this);
    // this.createCustomEmailTemplate = this.createCustomEmailTemplate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  validateEmail(email) {
    const emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const { validate } = this.state;
    if (emailRex.test(email)) {
      validate.emailState = 'has-success'
      this.setState({ entityEmailAddress: email });
      return true;
    }
    else {
      validate.emailState = 'has-danger'
      return false
    }
  }

  componentDidMount(){
    this.props.fetchDefaultEmail().then(()=>{
      this.setState({...this.state,defaultEmailTemplateTitle: this.props.currentDefaultEmailTemplate!.header})
    });
  }


  handleDefaultChange = async (emailBodyData: any) => {
    const verifyState = emailBodyData !== defaultEmailTemplate;
    const setDefaultState = (email) => {
       defaultEmailTemplate = email;
     }
     // console.log("emailBodyData", emailBodyData);
     // console.log("defaultEmailTemplate", defaultEmailTemplate);
     // console.log(verifyState);

     // tslint:disable-next-line only-arrow-functions
    function compareState() {
       if (verifyState) {
         setDefaultState(emailBodyData);
       }
     }
     compareState();
  }


  handleChange = (eventCurrentTarget: any) => {
       // console.log("the event currentTarget: ", eventCurrentTarget);
       switch(eventCurrentTarget.id) {
         case "entityEmailAddress":
            this.setState({ entityEmailAddress: eventCurrentTarget!.value });
             break;
         case "categorySetting":
             this.setState({ categorySetting: eventCurrentTarget!.value });
             break;
         case "defaultEmailTemplateTitle":
             this.setState({ defaultEmailTemplateTitle: eventCurrentTarget!.value });
             break;
       case "defaultEmailTemplate":
           defaultEmailTemplate = eventCurrentTarget!.value;
           break;
        }
     }

     createCategorySettings = async (event) => {
       event.preventDefault();
       const { categorySetting } = this.state;
       console.log("HERE IS >> this.state.categorySetting : ", categorySetting);

       if(this.state.categorySetting) {
         const genCategoryBundle = { category: categorySetting }
         JSON.stringify(genCategoryBundle);
         console.log("genCategoryBundle for Category API CALL", genCategoryBundle);
         await this.props.genCategory(genCategoryBundle);
         // const categories = this.props.fetchCategories();
         // await console.log("logged categories in hc : ", categories);
       }
     }

     createEntityEmail = async (event) => {
       event.preventDefault();
       const { entityEmailAddress } = this.state;
       console.log("HERE IS >> this.state.entityEmailAddress : ", entityEmailAddress);

       const validateEmail = this.validateEmail(entityEmailAddress);
       console.log("Entity Email Validated? >>>", validateEmail);

       if(entityEmailAddress && validateEmail ) {
         console.log("Here are the entityEmailAddress details: ", entityEmailAddress);

         const genEmailBundle = { email: entityEmailAddress }
         JSON.stringify(genEmailBundle);
         console.log("genEmailBundle for Entity Email API CALL", genEmailBundle);
         await this.props.genEntityEmailAddress(genEmailBundle);
         // const entityEmailAddresses = this.props.fetchEntityEmailAddresses();
         // await console.log("logged entityEmailAddresses in hc : ", entityEmailAddresses);
       }
     }

    createDefaultEmailTemplate = async (event) => {
      event.preventDefault();
      const { defaultEmailTemplateTitle } = this.state;
      console.log("HERE IS THE >> defaultEmailTemplate body VALUE : ", defaultEmailTemplate);
      if ((defaultEmailTemplateTitle === this.props.currentDefaultEmailTemplate!.header || !defaultEmailTemplateTitle) && defaultEmailTemplate === defaultEmailDefaultWording) {
        return;
      }

      const callDefaultEmailAPI = async () => {
        const defaultEmail = {header: defaultEmailTemplateTitle, body: defaultEmailTemplate}
        JSON.stringify(defaultEmail)

        // second check : Default body has been updated, check default ttile
        if (!defaultEmailTemplateTitle || defaultEmailTemplateTitle === this.props.currentDefaultEmailTemplate!.header ) {
          const unchangedEmailBodyPrompt = confirm( "The default email title remains unchanged. Are you only wanting to update the default email body?");
          if (unchangedEmailBodyPrompt === false) {
            return this.setState({promptMessage: "Please update the default email title and proceed."});
          }
        }
        // this.redirect();
        defaultEmailDefaultWording = defaultEmailTemplateTitle;
        return await this.props.setDefaultEmail(defaultEmail);
      }

      // first check: Check whether default body has changed
      if (defaultEmailTemplate === defaultEmailDefaultWording) {
        const unchangedEmailBodyPrompt = confirm( "The default email body text remains unchanged. Are you only wanting to update the default email title?");
        if (unchangedEmailBodyPrompt === true) {
          if (defaultEmailTemplateTitle && defaultEmailTemplate) {
            callDefaultEmailAPI();
          }
        }
        else {
          return this.setState({promptMessage: "Please update the default email body text and proceed."});
        }
      }
      else {
        callDefaultEmailAPI();
      }
    }

    redirect = () => {
      this.setState({submitted: true})
    }

    handleSubmit = (event) => {
      event.preventDefault(event);
      console.log("HANDLESUBMIT event >>> ", event);
      console.log("HANDLESUBMIT this.state >>> ", this.state);
      this.createCategorySettings(event);
      this.createEntityEmail(event);
      this.createDefaultEmailTemplate(event);
      // this.createCustomEmailTemplate(event);
    }

  render() {
    // console.log("SETTINGS this.props : ", this.props);
    console.log("TITLE : ", this.state.defaultEmailTemplateTitle);

    const { entityEmailAddress, categorySetting, defaultEmailTemplateTitle } = this.state;
    const valid: boolean = true;
    const row: boolean = true;
    const check: boolean = true;
    return (
      <Container className="CreateNewSettings">
        <h2 className="title">Customize the Digital Certificate Content</h2>
        <Form className="form" onSubmit={this.handleSubmit}>
          <br/>
          <FormGroup row={row}>
            <Label for="entityEmailAddress" sm={12}>Register a new email address for a business entity.</Label>
            <Col sm={12}>
              <Input
                type="email"
                name="entityEmailAddress"
                id="entityEmailAddress"
                placeholder="regenerative.software@holo.host"
                value={entityEmailAddress}
                onChange={e => this.handleChange(e!.currentTarget)}
              />
            </Col>
          </FormGroup>

          <FormGroup row={row}>
            <Label for="categorySetting" sm={12}>Register a new accounting category.</Label>
            <Col sm={12}>
              <Input
                type="text"
                name="categorySetting"
                id="categorySetting"
                placeholder="ICO Stage"
                value={categorySetting}
                onChange={e => this.handleChange(e!.currentTarget)}
              />
            </Col>
          </FormGroup>


          <br/>
          <br/>
          <h2 className="title">Customize the Digital Certificate Email Message</h2>
          <br/>
          <FormGroup row={row}>
            <Label for="currentDefaultEmailTemplate" sm={12}>Update default email template title.</Label>
            <Col sm={12}>
              <Input
                type="text"
                name="defaultEmailTemplateTitle"
                id="defaultEmailTemplateTitle"
                placeholder="Your New Holo Fuel Certificate is here!"
                value={defaultEmailTemplateTitle}
                onChange={e => this.handleChange(e!.currentTarget)}
              />
            </Col>
          </FormGroup>

          <FormGroup row={row}>
            <Label for="defaultEmailTemplate" sm={12}>Update default email template body.</Label>
            <Col sm={12}>
              <CKEditor
                  name="defaultEmailTemplate"
                  id="defaultEmailTemplate"
                  editor={ ClassicEditor }
                  data={defaultEmailTemplate}
                  onInit={ editor => {
                      console.log( 'Editor is ready to use!', editor );
                  }}
                  onChange={ ( event, editor ) => {
                      const data = editor.getData();
                      // console.log( { event, editor, data } );
                      this.handleDefaultChange(data);
                  }}
              />
            </Col>
          </FormGroup>

          <br/>
          <hr/>
          <h2 className="title">{this.state.errorMessage}</h2>
          <h2 className="title">{this.state.promptMessage}</h2>
          <hr/>
          <br/>

          <FormGroup check={check} row={row} style={{marginLeft:"0px"}}>
            <Col sm={{size:12}} style={{ marginLeft:"-1vw", }}>
              <Button style={{display: "block", margin:"auto", width:"100%"}}>Save</Button>
              {this.state.submitted ?
                <Redirect
                  to={{
                    pathname: "/fuelgenerator/dashboard",
                  }}
                />
              : <div/>
              }
            </Col>
          </FormGroup>
          <br/>
        </Form>
      </Container>
    );
  }
}

// const mapStateToProps = ({ currentAgent, allCategories, allEntityEmailAddresses, allCustomEmailTemplates, currentDefaultEmailTemplate }) => ({ currentAgent, allCategories, allEntityEmailAddresses, allCustomEmailTemplates, currentDefaultEmailTemplate });
// const mapDispatchToProps = dispatch => ({
//   fetchAgent: () => {
//     fetchPOST('/fn/profile/getAgent')
//       .then(agent => {
//         dispatch({ type: 'FETCH_AGENT', agent })
//       })
//   },
//   // handle Category Setting API calls
//   genCategory: (category) => {
//     return fetchPOST('/fn/settings/setCategory', category)
//     .then(newCatHash => {
//       console.log("newCatHash returned from local chain-->",newCatHash)
//       dispatch({ type: 'CREATE_NEW_CATEGORY', newCatHash })
//     })
//   },
//   fetchCategories: () => {
//     return fetchPOST('/fn/settings/getCategories')
//       .then(categories => {
//         console.log("categories returned from local chain-->",categories)
//         dispatch({ type: 'FETCH_ALL_CATEGORIES', categories })
//       })
//   },
// // handle Entity Email Setting API calls
//   genEntityEmailAddress: (entityEmail) => {
//     return fetchPOST('/fn/settings/setEmail', entityEmail)
//     .then(newEntityEmailHash => {
//       console.log("newEntityEmailHash returned from local chain-->", newEntityEmailHash)
//       dispatch({ type: 'CREATE_NEW_ENTITY_EMAIL', newEntityEmailHash })
//     })
//   },
//   fetchEntityEmailAddresses: () => {
//     return fetchPOST('/fn/settings/getEmails')
//       .then(entityEmailAddresses => {
//         console.log("entityEmailAddresses returned from local chain-->",entityEmailAddresses)
//         dispatch({ type: 'FETCH_ALL_ENTITY_EMAILS', entityEmailAddresses })
//       })
//   },
// // handle CUSTOM Email Template API calls
//   genCustomEmailTemplate: (emailTemplate) => {
//     return fetchPOST('/fn/settings/setCustomEmailDraft', emailTemplate)
//     .then(newCustomEmailHash => {
//       console.log("newCustomEmailHash returned from local chain-->",newCustomEmailHash)
//       dispatch({ type: 'CREATE_NEW_CUSTOM_EMAIL_TMPL', newCustomEmailHash })
//     })
//   },
//   fetchCustomEmailTemplates: () => {
//     return fetchPOST('/fn/settings/getCustomEmailDraft')
//       .then(emailTemplates => {
//         console.log("emailTemplates returned from local chain-->",emailTemplates)
//         dispatch({ type: 'FETCH_ALL_CUSTOM_EMAIL_TMPLS', emailTemplates })
//       })
//   },
// // handle DEFAULT Email Template API calls
//   setDefaultEmail: (defaultEmail) => {
//     return fetchPOST('/fn/settings/setDefaultEmailDraft', defaultEmail)
//     .then(newDefaultEmailHash => {
//       alert("Congrats. You have successfully updated your form")
//       console.log("newDefaultEmailHash returned from local chain-->", newDefaultEmailHash)
//       dispatch({ type: 'SET_DEFAULT_EMAIL_TMPL', newDefaultEmailHash })
//     })
//   },
//   fetchDefaultEmail: () => {
//     return fetchPOST('/fn/settings/getDefaultEmailDraft')
//       .then(defaultTemplate => {
//         console.log("defaultTemplate returned from local chain-->", defaultTemplate)
//         dispatch({ type: 'FETCH_DEFAULT_EMAIL_TMPL', defaultTemplate })
//       })
//   }
// })
//
// export default connect(mapStateToProps, mapDispatchToProps)(CreateNewSettings);
