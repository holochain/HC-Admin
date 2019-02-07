import * as React from 'react';
import classnames from 'classnames';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
// MUI Imports:
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
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
      initialItems: [""],
      items: []
    }
  };

  componentWillMount = () => {
    // TODO: pass the table data set into the items array, in order to allow sorting...
    this.setState({items: this.state.initialItems})
  }

  filterList = (event) => {
    const updatedList = this.state.initialItems;
    updatedList = updatedList.filter(function(item){
      return item.toLowerCase().search(
        event.target.value.toLowerCase()) !== -1;
    });
    this.setState({items: updatedList});
  }

  makeSearch = () => {
    // TODO: place logic to serach table at hand here....
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


// <div className={classes.search}>
//   <div className={classes.searchIcon}>
//     <SearchIcon style={{ color:"#95b9ed"}} />
//   </div>
//   <InputBase
//     placeholder="Search…"
//     onEnter={this.makeSearch}
//     classes={{
//       root: classes.inputRoot,
//       input: classes.inputInput,
//     }}
//   />
// </div>

// '&:focus': {
//   outline: 'bindActionCreators',
// },
