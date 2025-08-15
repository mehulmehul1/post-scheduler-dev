import IMGLYEditor, { EditorPreset, EditorSettingsModel, SourceType } from '@imgly/editor-react-native';
import { getCESDKLicense } from '../lib/cesdk';

export async function openEditorForUri(uri: string, isVideo: boolean) {
  const settings = new EditorSettingsModel({
    license: getCESDKLicense(),
    userId: 'kamo-user',
  });
  const result = await IMGLYEditor.openEditor(
    settings,
    { source: uri, type: isVideo ? SourceType.VIDEO : SourceType.IMAGE },
    isVideo ? EditorPreset.VIDEO : EditorPreset.DESIGN,
  );
  return result;
}
