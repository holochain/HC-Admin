import * as React from 'react';
import classnames from 'classnames';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
// MUI Imports:
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
// Local Imports
import logo from '../../assets/icons/HC_Logo.svg';
import styles from '../styles/component-styles/DashboardMuiStyles';


function SearchList({ classes, items }) {
  return (
    <ul className="list-group">
    {
      items.map(function(item) {
        return <li className="list-group-item" data-category={item} key={item}>{item}</li>
      })
     }
    </ul>
  );
}


class SearchBar extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {
      defaultData: [
        "holofuel_pagination.hcpkg",
        "test agent 2",
        "DNA Instance",
        "holofuel_pagination.hcpkg instance"
      ],
      items: []
    }
  };

  componentDidMount = () => {
    console.log("search for tableData within PROPS (inside SearchBar)", this.props);
    const items = this.props.tableData ? this.props.tableData : this.state.defaultData; // TODO: change the `else` PART of ternry to an empty array instead : (ie: `[]`)
    this.setState({ items });
  }

  filterList = (event) => {
    let updatedList = this.state.defaultData;
    updatedList = updatedList.filter(function(item){
      return item.toLowerCase().search(
        event.target.value.toLowerCase()) !== -1;
    });
    this.setState({items: updatedList});
  }

  locateSearchItem = () => {
    // TODO: place logic to connect search to table here....

// fitler against Row Value :
    // filterMethod: (filter, rows) =>
    //   matchSorter(rows, filter.value, { keys: ["instanceId"] }),
    // filterAll: true,
  }

  render () {
    const { classes } = this.props;
    const noWrap : boolean = true;

    return (
      <div className="filter-list">
        <form>
          <fieldset className={classnames(classes.formGroupFieldset, "form-group")}>
            <input type="text" className={classnames(classes.searchBtnInput, "form-control", "form-control-lg")} placeholder="Search" onChange={this.filterList}/>
          </fieldset>
        </form>
        <SearchList items={this.state.items}/>
      </div>
    );
  }
}

export default withStyles(styles)(SearchBar);
