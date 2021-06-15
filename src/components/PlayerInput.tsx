import React from "react";

export interface IPlayerInputProps {
    inputCallback: (input: string) => void;
}

export class PlayerInput extends React.Component<IPlayerInputProps> {
    state = {
        playerName: ''
    }

    render() {
        return (
            <div
                className="modal show d-block"
                id="staticBackdrop"
                data-backdrop="static"
                data-keyboard="false"
                tabIndex={-1}
                aria-labelledby="staticBackdropLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <form
                        className="modal-content"
                        onSubmit={e => {
                            e.stopPropagation();
                            e.preventDefault();
                            this.props.inputCallback(this.state.playerName)
                        }}
                    >
                        <div className="modal-header">
                            <h5 className="modal-title" id="staticBackdropLabel">Please enter player name</h5>
                        </div>
                        <div className="modal-body">
                            <input
                                onChange={e => {
                                    this.setState({
                                        playerName: e.target.value
                                    })
                                }}
                                value={this.state.playerName}
                                className={'form-control'}
                                type={'text'}
                            />
                        </div>
                        <div className="modal-footer">
                            <button type="submit" className="btn btn-primary">OK</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}
