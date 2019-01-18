import * as React from 'react';
import * as redux from 'redux';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Link } from 'react-router-dom';

import { render } from "react-dom";
import matchSorter from 'match-sorter';
import ReactTable from "react-table";
import NoCertsErrorMessage from "./NoCertsErrorMessage";
import "react-table/react-table.css";
import "../style/AdminTable.css";

type AdminTableProps = {
  currentAgent: { agent: { Hash: Hash, Name: string } },
  allCertificates: [CertificateDetailState] | null,
  fetchAgent: () => void,
  fetchUserIOUs: () => void,
  getAllIOUs: () => void,
  returnState: () => void,
}

type AdminTableState = {
  data: [{}] | null,
  row: string,
  filter: any,
}

export default class AdminTableView extends React.Component<AdminTableProps, AdminTableState> {
  static getDerivedStateFromProps(props, state) {
    const { allCertificates } = props;
    if (!allCertificates) {
      return null;
    }
    else {
      const data: [{}] = AdminTableView.dataRefactor(allCertificates);
      console.log("data", data);

      return ({ data });
      // console.log("this.state ", this.state);
    }
  }

  /*///////////////////////////////////////////////////////////////
      Table Data Generation Helper Functionm : Currency Display
   ////////////////////////////////////////////////////////////////*/
  static addCurrencyCommas(certAmount) {
    const random = certAmount;
    const numArray = random.split('.');

    let firstNum = numArray[0];
    const nextNum = numArray.length > 1 ? '.' + numArray[1] : '';
    const rgx = /(\d+)(\d{3})/;
    while (rgx.test(firstNum)) {
      firstNum = firstNum.replace(rgx, '$1' + ',' + '$2');
    }
    return firstNum + nextNum;
  }

  /*///////////////////////////////////////////////
      Table Data Generation Helper Function : Date
   ////////////////////////////////////////////////*/
  static formatDate(dateObj) {
    const stringedDate = dateObj.split("-");
    console.log(stringedDate);

    const dd = stringedDate[2];
    const mm = stringedDate[1];
    const yyyy = stringedDate[0];

    const datestamp = mm + '/' + dd + '/' + yyyy;
    return datestamp;
  }

  /*///////////////////////////////////////////////////
      Table Data Generation Helper Function MAIN
   ////////////////////////////////////////////////////*/
  static dataRefactor(ious) {
    console.log("this should show this.props.allcerts >> as passed in... ", ious);
    const CERT_LENGTH = ious.length;
    console.log("CERT_LENGTH: ", CERT_LENGTH);

    const insertCertificate = (iou) => {
      console.log("inside insertCertificate");
      console.log("iou", iou);
      if (iou !== parseInt(iou, 10)) {
        const amount = this.addCurrencyCommas(iou.amount);
        console.log("amount", amount);
        const baseDate = this.formatDate(iou.baseDate);
        console.log("baseDate", baseDate);
        const newObj = {
          email: iou.email,
          viewDetails: "Details",
          entityId: iou.entityId,
          category: iou.category,
          amount,
          baseDate,
          notes: iou.notes,
        };
        console.log("newObj", newObj);
        return newObj;
      }
      else {
        return "";
      }
    }

    const range = (length) => {
      const lengthArray: Array<any> = [];
      for (let i = 0; i < length; i++) {
        lengthArray.push(i);
      }
      return lengthArray;
    };

    const dataGenerate = (length = CERT_LENGTH) => {
      return ious.map(iou => {
        return {
          ...insertCertificate(iou),
          children: range(length - 1).map(insertCertificate) // # per page...
        };
      })
    }
    return dataGenerate()
  }


  constructor(props) {
    super(props);
    this.state = {
      data: null,
      row: "",
      filter: "",
    };
    this.filterData = this.filterData.bind(this);

  }

  filterData = () => {
    const row = this.state.row;
    const filter = this.state.filter;
    return String(row[filter.id]) === filter.value;
  }

  componentDidMount() {
    this.props.getAllIOUs();
    this.props.returnState();

    this.render();
  }


  render() {
    const { data } = this.state;
    console.log("Component Props: : ", this.props)
    let certLength : number;

    if (this.props.allCertificates) {
      certLength = this.props.allCertificates!.length;
      console.log("certLength : ", certLength);
      if (certLength === 0) {
        return (
          <NoCertsErrorMessage />
        )
      }
    }

    if (!data || !this.props.allCertificates) {
      return (
        <NoCertsErrorMessage />
      )
    }

    console.log("data: ", data)
    const filterable: boolean = true;
    return (
      <div className="table-view">
        <br />

        <ReactTable
          style={{ minHeight: "70vh", margin: "0px -10px 50px -10px", border: "3px solid whitesmoke", boxShadow: "0px 1px 0px 2px #2d2f38", background: "#eee" }}
          data={data}
          filterable={filterable}
          defaultFiltedMethod={this.filterData()}
          // tslint:disable-next-line jsx-no-lambda
          trClassCallback={rowInfo => rowInfo.row.status ? '#999ca7' : 'whitesmoke'}
          columns={[
            {
              Header: "Personal Details",
              columns: [
                {
                  Header: "Email",
                  accessor: "email",
                  width: 300
                }]
            },
            {
              Header: "Certificate Details",
              columns: [
                /* {
                  Header: "View Details",
                  accessor: "viewDetails",
                  width: 100
                }, */
                {
                  Header: "Entity ID",
                  accessor: "entityId",
                  width: 260
                },
                {
                  Header: "Category",
                  accessor: "category",
                  width: 300
                },
                {
                  Header: "Amount",
                  accessor: "amount",
                  width: 300
                },
                {
                  Header: "Base Date (mm/dd/yyyy)",
                  accessor: "baseDate",
                  width: 135
                },
                {
                  Header: "Notes",
                  accessor: "notes",
                  width: 350
                }
              ]
            }
          ]}
          defaultPageSize={10}
          className="react-table -striped -highlight"
        />
      </div>
    );
  }
}
//
// const mapStateToProps = ({ allCertificates, currentAgent }) => ({ allCertificates, currentAgent });
// const mapDispatchToProps = dispatch => ({
//   fetchAgent: () => {
//     fetchPOST('/fn/profile/getAgent')
//       .then(agent => {
//         dispatch({ type: 'FETCH_AGENT', agent })
//       })
//   },
//   getMyIOUs: (userHash) => {
//     return fetchPOST('/fn/generator/getMyIOUs', userHash)
//       .then(iouObjList => {
//         dispatch({ type: 'FETCH_ALL_USER_CERTIFICATES', iouObjList })
//       })
//   },
//   getAllIOUs: () => {
//     return fetchPOST('/fn/generator/getAllIOU')
//       .then(iou => {
//         // console.log("iou returned from local chain-->",iou)
//         dispatch({ type: 'FETCH_ALL_CERTIFICATES', iou })
//       })
//   },
//   returnState: () => dispatch({ type: 'RETURN_STATE' })
// });
//
// export default connect(mapStateToProps, mapDispatchToProps)(AdminTableView);
