import React, { PureComponent } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { updateFormValue } from '../../actions/RightPaneActions';
import RightPaneStore from '../../stores/RightPaneStore.js';
import { termData } from '../../termData';

class TermSelector extends PureComponent {
    state = {
        term: RightPaneStore.getFormData().term,
    };

    resetField = () => {
        this.setState({ term: RightPaneStore.getFormData().term });
    };

    componentDidMount = () => {
        document.addEventListener('keydown', this.enterEvent, false);
        RightPaneStore.on('formReset', this.resetField);
    };

    componentWillUnmount() {
        RightPaneStore.removeListener('formReset', this.resetField);
    }

    handleChange = (event) => {
        this.setState({ term: event.target.value });
        updateFormValue('term', event.target.value);
    };

    render() {
        return (
            <FormControl fullWidth>
                <InputLabel>Term</InputLabel>
                <Select value={this.state.term} onChange={this.handleChange}>
                    {termData.map((term) => (
                        <MenuItem value={term.shortName}>{term.longName}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        );
    }
}

export default TermSelector;
