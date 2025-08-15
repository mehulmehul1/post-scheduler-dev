import { View, Button } from 'react-native';
import { openEditorForUri } from '../components/EditorLauncher';
import { useEditedMedia } from '../hooks/useEditedMedia';

export function EditorScreen() {
  const [, setEdited] = useEditedMedia();

  const handleEdit = async () => {
    const result = await openEditorForUri('file://placeholder.jpg', false);
    if (result) {
      setEdited({ uri: result as string, type: 'image' });
    }
  };

  return (
    <View>
      <Button title="Edit" onPress={handleEdit} />
    </View>
  );
}
