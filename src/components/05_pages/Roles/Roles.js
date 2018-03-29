import React, { Component } from 'react';
import { func, arrayOf, object } from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import LoadingBar from 'react-redux-loading-bar';

import { MESSAGE_ERROR } from '../../../actions/application';
import { requestRoles } from '../../../actions/roles';
import { cancelTask } from '../../../actions/helpers';
import { Table, TBody, THead } from '../../01_subatomics/Table/Table';
import Message from '../../02_atoms/Message/Message';

const Roles = class Roles extends Component {
  componentWillMount() {
    this.props.requestRoles();
  }
  componentWillUnmount() {
    this.props.cancelTask();
  }
  createTableRows = roles =>
    roles.map(({ attributes: { label, id } }) => ({
      key: `row-${label}`,
      tds: [
        [`td-${label}`, label],
        [
          `td-${label}-actions`,
          <Link to={`/admin/people/permissions/${id}`}>Edit Permissions</Link>,
        ],
      ],
    }));
  render = () => {
    if (this.state.err) {
      return <Message message="Error loading roles" type={MESSAGE_ERROR} />;
    }
    if (!this.props.roles) {
      return <LoadingBar />;
    }
    return (
      <Table>
        <THead data={['NAME', 'OPERATIONS']} />
        <TBody rows={this.createTableRows(this.props.roles)} />
      </Table>
    );
  };
};

Roles.propTypes = {
  requestRoles: func.isRequired,
  cancelTask: func.isRequired,
  roles: arrayOf(object),
};

Roles.defaultProps = {
  roles: [],
};

const mapStateToProps = ({ application: { roles, error } }) => ({
  roles,
  error,
});

export default connect(mapStateToProps, { requestRoles, cancelTask })(Roles);
