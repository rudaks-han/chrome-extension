import React from 'react';
import { List, Image } from 'semantic-ui-react';
import UiShare  from '../../UiShare';

const AssignToMeList = props => {
    if (props.list == null) {
        return UiShare.displayListLoading();
    } else {
        return props.list.map(item => {
            const { issueKey, project, summary, issueType } = item;

            return <List.Item key={issueKey.stringValue}>
                <Image avatar src={issueType.iconUrl} />
                <List.Content className='image_content'>
                    <List.Header>
                        <a href={`https://enomix.atlassian.net/browse/${issueKey.stringValue}`} rel="noreferrer" target="_blank">{summary.textValue}</a>
                    </List.Header>
                    <List.Description>{issueKey.stringValue} | {project.name}</List.Description>
                </List.Content>
            </List.Item>;
        });
    }
};

export default AssignToMeList;
