import * as React from 'react';
import { connect } from 'react-redux'
import { Link, Redirect  } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';

import { createJWT } from "../utils/jwt-generator";
import { refactoCSV } from "../utils/wrap-cvs";
import { sendEmail, mail } from "../utils/sendGrid"
import { fetchPOST, HOLO_ADMIN_EMAIL, HOLO_CERTIFICATE_MANAGER_WEBSITE } from '../utils';
import { CSVLink, CSVDownload } from "react-csv";

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

type CreateNewCertificateState = {
  email: string,
  entityId: string,
  category: string,
  amount: string,
  baseDate: string,
  notes: string,
  emailTitle: string,
  emailBody: string,
  file: string,
  validate: { emailState: string },
  errorMessage: string,
  submitted: boolean,
}

type CertificateProps = {
  allCertificates: [CertificateDetailState] | null,
  allCategories: [string] | null,
  allEntityEmailAddresses: [string] | null,
  allCustomEmailTemplates: [EmailTemplateState] | null,
  currentDefaultEmailTemplate: EmailTemplateState | null,
  currentAgent: { agent: { Hash: string, Name: string } },
  loggedin: boolean,
  fetchAgent: () => void,
  createNewCertficate: (IOUobj: {}) => void,
  getAllIOUs: () => void,
  fetchCategories: () => void,
  fetchEntityEmailAddresses: () => void,
  fetchEmailTemplates: () => void,
  fetchDefaultEmail: () => void,
}

export type iouObjType = {
  email:string,
  amount:string,
  entityId:string,
  category:string,
  baseDate:string,
  notes:string,
}

const csvData = [
  // ["Certificate Owners Email", "Amount", "Entity Email","Category","Date YYYY-MM-DD","Note"],
  ["zo@el.org", "14316", "certificate@holo.host","Regen","2017-01-31","This is a note"],
  ["li@sa.org", "696969", "certificate@regenerativesoftware.com","Regen","2017-02-30","This is a note"]
];

export default class CreateNewCertificate extends React.Component<CertificateProps, CreateNewCertificateState>  {
  constructor(props: any) {
    super(props);
    this.state = {
      email: "",
      entityId: "",
      category: "",
      amount: "",
      baseDate: "",
      notes: "",
      emailTitle: "",
      emailBody: "",
      file: "",
      validate: {
        emailState: "",
      },
      errorMessage: "",
      submitted: false,
    }
    this.handleChange = this.handleChange.bind(this);
    this.createCertficate = this.createCertficate.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
    this.createCertficateCSV = this.createCertficateCSV.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
  }

  componentDidMount() {
    this.props.fetchCategories();
    this.props.fetchEntityEmailAddresses();

    this.props.fetchDefaultEmail();
    this.props.fetchEmailTemplates();
  }

handleFileUpload(event) {
  const files = event.target.files;
  const self=this;
  const fileReader = new FileReader();
  fileReader.onload = () => {
    const lines=fileReader.result.split('\n').map((line)=>{
      return line.split(',');
    })
    console.log("CSV: ",lines)
    self.createCertficateCSV(lines);
  }
  fileReader.readAsText(files[0])
}

 createCertficateCSV = async (payload) => {
  const csvCertificates: any = refactoCSV(payload);
  console.log("csv Certificates: ", csvCertificates);
  if (csvCertificates.error) {
    alert("CSV Validation Fail: " + csvCertificates.error);
  } else {
    csvCertificates.forEach((certificates) => {
      if (certificates.email !== "") {
        setTimeout(this.createNewCertficate(certificates), 1000);
      }
    })
  }
}

  validateEmail(email) {
    const emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const { validate } = this.state;
    if (emailRex.test(email)) {
      validate.emailState = 'has-success'
      this.setState({ email });
    }
    else {
      validate.emailState = 'has-danger'
    }
    this.setState({ validate })
  }

  handleChange = (event: any) => {
       switch(event.target.id) {
         case "email":
              this.setState({ email: event.target.value });
              break;
         case "entityId":
             console.log("entityid event.target : ",  event.target );
             this.setState({ entityId: event.target.value });
              break;
         case "category":
             this.setState({ category: event.target.value });
              break;
         case "amount":
             this.setState({ amount: event.target.value });
              break;
         case "baseDate":
              this.setState({ baseDate: event.target.value });
               break;
         case "notes":
             this.setState({ notes: event.target.value });
              break;
        }
        console.log("state: ", this.state);
     }

  createCertficate = async (event) => {
    event.preventDefault();
    const { email, entityId, amount, category, baseDate, notes } = this.state;
    this.createNewCertficate({email, entityId, amount, category, baseDate, notes} );
  }

  createNewCertficate=async({email, entityId, amount, category, baseDate, notes })=>{

    let entityIdName=entityId;
    if(entityId==="certificate@holo.host"){
      entityIdName='Holo Ltd'
    }else if(entityId==="certificates@regenerativesoftware.com"){
      entityIdName="Regenative Software, LLC"
    }
    const IOUobj = {
      email,
      amount,
      entityId:entityIdName,
      category,
      baseDate,
      notes,
    }
    console.log("Here are the sent details: IOU OBJECT: ", IOUobj);
    console.log("this.state.file", this.state.file);

    //  1.crete JWT token with  IOUobj
    const jwt=createJWT(IOUobj)
    console.log("jwt Created", jwt);
    // const date = new Date();

    //  2.API Action, deliver data to backend
    fetchPOST('/fn/generator/createIOU', { jwt, email, entityId:entityIdName, amount, category, baseDate, notes})
      .then(res => {
        if (!res.error) {
          // 3.  CALL REDUX
          this.props.createNewCertficate(IOUobj);

// TODO: UNCOMMENT THE FOLLOWING, once the email settings are complete...
        // 4. Send Email (SendGrid)


          const mailToUser =  {
            "personalizations": [
              {
                "to": [
                  {
                    "email": email
                  }
                ],
                "subject": this.props.currentDefaultEmailTemplate? this.props.currentDefaultEmailTemplate!.header : "Your New HoloFuel Certificate is here!"
              }
            ],
            "from": {
              "email": entityId,
              "name":entityIdName
            },
            "content": [
              {
                "type": "text/html",
                  "value":  `<div style:{text-align: center}>
                  <table border="5">
                  <tr><th>
                  <img src="https://i.imgur.com/uV2Oq3g.png" style="width:200px;height:128px;"/>
                  <blockquote>
                  <h1>Here is your HoloFuel Certificate: </h1>
                  <br><table border="1">
                  <tr><th>
                  <strong>${jwt}</strong>
                  </th></tr>
                  </table>
                  </blockquote>
                  ${this.props.currentDefaultEmailTemplate ? this.props.currentDefaultEmailTemplate!.body : ""}
                  </div>
                  </th></tr>
                  </table>`
              }
            ]
          }
          sendEmail(mailToUser)
      }
    })
    .then(res => {
        this.setState({submitted: true})
    })
}

  render() {
    console.log("this.props : ", this.props);

    const { email, entityId, category, amount, baseDate, notes } = this.state;
    const valid: boolean = true;
    const row: boolean = true;
    const check: boolean = true;
    return (
      <Container className="CreateNewCertificate">
        <h2 className="title" style={{color: "#282a2f"}}>Register New Certificate Via the Form Below</h2>
        <hr style={{color: "#282a2f"}}/>
        <Form className="form" onSubmit={this.createCertficate}>
          <h2 className="title">Generate Single Certificate</h2>
          <FormGroup row={row}>
            <Label for="email" sm={12}>Certificate Owner email</Label>
            <Col sm={12}>
              <Input
                type="email"
                name="email"
                id="email"
                placeholder="myemail@email.com"
                value={email}
                onChange={this.handleChange}
                valid={this.state.validate.emailState === 'has-success'}
                invalid={this.state.validate.emailState === 'has-danger'}
              />
              <FormFeedback valid={valid}>
                This email matches the basic format requirements. Please be sure to still doublecheck all client email entries to ensure accuracy.
            </FormFeedback>
              <FormFeedback>
                Uh oh! Looks like there is an issue with your email. Please input the client's correct email.
            </FormFeedback>
            </Col>
          </FormGroup>

          {/* Email Entity Settings >> Populated by redux state to props => allCategories  */}
          <FormGroup row={row}>
            <Label for="entityId" sm={12}>Entity ID</Label>
            <Label style={{fontWeight:"lighter", marginLeft:"20px"}}><em>(NB: The client notification email will be sent from this address.)</em></Label>
            <Col sm={12}>
              <select
              name="entityId"
              id="entityId"
              className="form-control"
              value={entityId}
              onChange={this.handleChange}
              >
                <option className="capitalize-text">Please Select the Entity Below</option>
                {this.props.allEntityEmailAddresses ?  this.props.allEntityEmailAddresses!.map(entityEmail => {
                  if(entityEmail==="certificate@holo.host"){
                    return(
                      <option className="capitalize-text" value={entityEmail} key={entityEmail}>Holo Ltd</option>
                    )
                  }else if (entityEmail==="certificates@regenerativesoftware.com"){
                    return(
                      <option className="capitalize-text" value={entityEmail} key={entityEmail}>Regenative Software, LLC</option>
                    )
                  }else{
                    return(
                      <option className="capitalize-text" value={entityEmail} key={entityEmail}>{entityEmail.replace(/\-+/g, " ")}</option>
                    )
                  }

                }) : <option className="capitalize-text" value="None">None created. Please add a Entity Email in the Settings Tab.</option>}
              </select>
            </Col>
          </FormGroup>

          {/* Accouting Category Settings >> Populated by redux state to props => allCategories  */}
          <FormGroup row={row}>
            <Label for="category" sm={12}>Accounting Category</Label>
            <Col sm={12}>
              <select
              name="category"
              id="category"
              className="form-control"
              value={category}
              onChange={this.handleChange}
              >
              <option className="capitalize-text">Please Select the Category Below</option>
              {this.props.allCategories ?  this.props.allCategories!.map(categorySetting => {
                return (
                  <option className="capitalize-text" value={categorySetting} key={categorySetting}>{categorySetting}</option>
                )
              }) : <option className="capitalize-text" value="None">None created. Please add an Category in the Settings Tab.</option>}
              </select>
            </Col>
          </FormGroup>

          <FormGroup row={row}>
            <Label for="amount" sm={12}>Amount</Label>
            <Col sm={12}>
              <Input
                type="number"
                name="amount"
                id="amount"
                placeholder="478,390,209,495,895.00 HOT"
                value={amount}
                onChange={this.handleChange}
              />
            </Col>
          </FormGroup>

          <FormGroup row={row}>
            <Label for="baseDate" sm={12}>Basis Date</Label>
            <Col sm={12}>
              <Input
                type="date"
                name="baseDate"
                id="baseDate"
                placeholder="May 30,2017"
                value={baseDate}
                onChange={this.handleChange}
              />
            </Col>
          </FormGroup>
          <FormGroup row={row}>
            <Label for="notes" sm={12}>Internal Accounting Notes</Label>
            <Col sm={12}>
              <Input
                type="textarea"
                name="notes"
                id="notes"
                placeholder="This happened during pre-sale..."
                cols="30"
                rows="10"
                value={notes}
                onChange={this.handleChange}
              />
            </Col>
          </FormGroup>
          <hr/>
          <FormGroup check={check} row={row}>
            <Col sm={{ size: 10, offset: 2 }}>
              <Button>Submit</Button>
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
          <hr/>
          <br/>

          {/* // UPLOAD MULTIPLE CSV FILES HERE: */}
          <h2 className="title">Upload Multiple Certificates</h2>
          <CSVLink data={csvData}>Download Sample CSV Here</CSVLink>
          <FormGroup row={row}>
            <Label className="upload-expense" for="fileUpload" sm={12}>File Upload</Label>
            <Col sm={12}>
              <Input type="file" accept=".csv" name="file" id="fileUpload" className="input-file" onChange={this.handleFileUpload} />
              <FormText color="muted">
                Please attach any relevant files regarding the certificate here.
            </FormText>
            </Col>
          </FormGroup>
        <hr/>
        </Form>
      </Container>
    );
  }
}

//
// const mapStateToProps = ({ currentAgent, allCategories, allEntityEmailAddresses, allCustomEmailTemplates, currentDefaultEmailTemplate }) => ({ currentAgent, allCategories, allEntityEmailAddresses, allCustomEmailTemplates, currentDefaultEmailTemplate });
// const mapDispatchToProps = dispatch => ({
//   fetchAgent: () => {
//     fetchPOST('/fn/profile/getAgent')
//       .then(agent => {
//         dispatch({ type: 'FETCH_AGENT', agent })
//       })
//   },
//   getAllIOUs: () => {
//     return fetchPOST('/fn/generator/getAllIOU')
//       .then(iou => {
//         // console.log("iou returned from local chain-->",iou)
//         dispatch({ type: 'FETCH_ALL_CERTIFICATES', iou })
//       })
//   },
//   createNewCertficate: (IOUobj) =>  dispatch({ type: 'CREATE_NEW_CERTIFICATE', params:IOUobj }),
//   fetchCategories: () => {
//     return fetchPOST('/fn/settings/getCategories')
//       .then(categories => {
//         console.log("categories returned from local chain-->",categories)
//         dispatch({ type: 'FETCH_ALL_CATEGORIES', categories })
//       })
//   },
//   fetchEntityEmailAddresses: () => {
//     return fetchPOST('/fn/settings/getEmails')
//       .then(entityEmailAddresses => {
//         console.log("entityEmailAddresses returned from local chain-->",entityEmailAddresses)
//         dispatch({ type: 'FETCH_ALL_ENTITY_EMAILS', entityEmailAddresses })
//       })
//   },
//   fetchEmailTemplates: () => {
//     return fetchPOST('/fn/settings/getCustomEmailDraft')
//       .then(customTemplates => {
//         console.log("customEmailTemplates returned from local chain-->",customTemplates)
//         dispatch({ type: 'FETCH_ALL_CUSTOM_EMAIL_TMPLS', customTemplates })
//       })
//   },
//   fetchDefaultEmail: () => {
//     return fetchPOST('/fn/settings/getDefaultEmailDraft')
//       .then(defaultTemplate => {
//         console.log("defaultEmailTemplate returned from local chain-->", defaultTemplate)
//         dispatch({ type: 'FETCH_DEFAULT_EMAIL_TMPL', defaultTemplate })
//       })
//   }
// })
//
// export default connect(mapStateToProps, mapDispatchToProps)(CreateNewCertificate);
