import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { arrayMove } from 'react-sortable-hoc';
import shortId from 'short-id';

import { Button } from '../styledComponents/theme';
import { Heading2 } from '../styledComponents/typography';

import NewPoll from '../components/NewPoll';
import TextWrapper from '../components/TextWrapper';


const CreateButton = styled(Button)`
  background-image: linear-gradient(19deg, #21d4fd 0%, #b721ff 100%);
  margin-left: 20px;
`;

const ActionContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const TitleContainer = styled.div`
  display: inline-flex;
  width: 350px;
  flex-direction: column;
  margin-bottom: 30px;
`;

const TitleLabel = styled.label`
  font-weight: bold;
`;

const TitleInput = styled.input`
  color: black;
  font-size: 18px;
`;

class NewPollPage extends Component {
  static contextTypes = {
    firebase: PropTypes.object,
  };

  static propTypes = {
    history: PropTypes.object.isRequired,
    uid: PropTypes.string,
    signIn: PropTypes.func.isRequired,
  };

  state = {
    title: '',
    options: [],
    loading: false,
  };

  // to keep track of what item is being edited
  editing = null;

  handleKeydown = e => {
    if (e.which === 27) this.handleToggleEdit(this.editing);
    if (e.which === 13) this.handleAddItem();
  };

  handleToggleEdit = id => {
    this.setState(prevState => {
      const options = prevState.options
        .filter(({ text }) => text)
        .map(option => {
          if (option.id === id) {
            if (!option.editing) {
              this.editing = id;
            } else {
              this.editing = null;
            }

            return {
              ...option,
              editing: !option.editing,
            };
          }

          return {
            ...option,
            editing: false,
          };
        });

      return {
        ...prevState,
        options,
      };
    });
  };

  handleTitleChange = e => {
    const { value } = e.target;

    this.setState({
      title: value,
    });
  };

  handleTextChange = (e, id) => {
    let { options } = this.state;
    options = options.map(option => {
      if (option.id === id) {
        return {
          ...option,
          text: e.target.value,
        };
      }
      return option;
    });

    this.setState( (prevState) => ({
      ...prevState,
      options,
    }))
  };

  handleSortEnd = ({ oldIndex, newIndex }) => {
    const { options } = this.state;
    this.setState((prevState) => ({
      ...prevState,
      options: arrayMove(options, oldIndex, newIndex),
    }))
  };

  handleAddItem = () => {
    // if the user spams add w/o writing any text the items w/o any text get removed
    let { options } = this.state;
    // filter out any falsy values from the list
    options = options
      .filter(Boolean)
      .filter(({ text }) => !!text.trim())
      .map(option => ({
        ...option,
        editing: false,
      }));
    const id = shortId.generate();
    this.editing = id;

    this.setState((prevState) => ({
      ...prevState,
      options: [
        ...options,
        {
          id,
          text: '',
          editing: true,
        },
      ],
    }))
  };

  handleDelete = id => {
    let { options } = this.state;
    options = options.filter(option => option.id !== id);

    this.setState((prevState) => ({
      ...prevState,
      options,
    }));
  };

  handleCreate = (auth) => {
    console.log('In handleCreate, auth:', auth);
    const pollId = shortId.generate();
    const { signIn, uid } = auth;
    // eslint-disable-next-line
    // debugger;

    this.setState({
      loading: true,
    });

    if (!uid) {
      // due to our database rules, we can't write unless a uid exists
      signIn('anonymous').then(() => {
        this.createPoll(pollId);
      });
    } else {
      this.createPoll(pollId);
    }
  };

  createPoll(pollId) {
    const { firebase } = this.context;
    const { options, title } = this.state;
    const { history } = this.props;

    firebase.polls
      .doc(pollId)
      .set({
        title,
        id: pollId,
        options: options.map(({ text, id }) => ({ text, optionId: id })),
      })
      .then(() => {
        this.setState({
          options: [],
          loading: false,
          title: '',
        });

        history.push(`/poll/${pollId}`);
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error(error);
        // TODO: notify the user of the error
      });
  }

  render() {
    const { options, loading, title } = this.state;
    const optionsWithText = options.filter(({ text }) => !!text.trim());
    const disableCreate = !title || optionsWithText.length < 2 || loading;
    console.log('Before TextWrapper', this.props);
    return (
      <TextWrapper>
        {
          (auth) => {
            return (
              <div>
                <Heading2>Create a new Poll</Heading2>
                <TitleContainer>
                  <TitleLabel htmlFor="newPollTitle">Title</TitleLabel>
                  <TitleInput
                    id="newPollTitle"
                    value={title}
                    onChange={this.handleTitleChange}
                  />
                </TitleContainer>
                <NewPoll
                  options={options}
                  onToggleEdit={this.handleToggleEdit}
                  onTextChange={this.handleTextChange}
                  onKeyDown={this.handleKeydown}
                  onSortEnd={this.handleSortEnd}
                  onDelete={this.handleDelete}
                />
                <ActionContainer>
                  <Button
                    disabled={disableCreate}
                    onClick={!disableCreate && (() => this.handleCreate(auth))}>
                    {loading ? 'Creating...' : 'Create'}
                  </Button>
            
                  <CreateButton
                    disabled={loading}
                    onClick={!loading && this.handleAddItem}>
                    Add
                  </CreateButton>
                </ActionContainer>
              </div>
            );
          }
        }
      </TextWrapper>
    );
  }
}

export default NewPollPage;