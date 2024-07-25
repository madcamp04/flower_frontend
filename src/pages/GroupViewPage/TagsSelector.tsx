import React from 'react';
import { Select, MenuItem, Checkbox, ListItemText, Chip, Input } from '@mui/material';

interface TagsSelectorProps {
  tags: string[];
  activeTags: string[];
  setActiveTags: (tags: string[]) => void;
}

const TagsSelector: React.FC<TagsSelectorProps> = ({ tags, activeTags, setActiveTags }) => {
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setActiveTags(event.target.value as string[]);
  };

  return (
    <Select
      multiple
      value={activeTags}
      onChange={handleChange}
      input={<Input />}
      displayEmpty
      renderValue={(selected) => {
        if ((selected as string[]).length === 0) {
          return <span>Select Tags</span>;
        }
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {(selected as string[]).map((value) => (
              <Chip key={value} label={value} style={{ margin: 2 }} />
            ))}
          </div>
        );
      }}
      sx={{ width: 200 }} // Set the fixed width here
      MenuProps={{
        PaperProps: {
          style: {
            maxHeight: 48 * 4.5 + 8, // Limit the menu height if necessary
          },
        },
      }}
    >
      {tags.length === 0 ? (
        <MenuItem disabled>No Tags Available</MenuItem>
      ) : (
        tags.map((tag) => (
          <MenuItem key={tag} value={tag}>
            <Checkbox checked={activeTags.indexOf(tag) > -1} />
            <ListItemText primary={tag} />
          </MenuItem>
        ))
      )}
    </Select>
  );
};

export default TagsSelector;
