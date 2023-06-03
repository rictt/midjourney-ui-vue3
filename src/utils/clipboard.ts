import ClipboardClass from 'clipboard';

export const copyString = (copyString: string) => {
  const mockBtn = document.createElement('button');
  mockBtn.style.display = 'none';
  const clipboard = new ClipboardClass(mockBtn, {
    text: () => copyString
  });


  clipboard.on('success', () => {
    clipboard.destroy();
  });

  clipboard.on('error', () => {
    clipboard.destroy();
  });

  // 模拟点击一下，触发 clipboard
  mockBtn.click();
  // 移除掉这个 mock dom
  mockBtn.remove();
};

export const Clipboard = ClipboardClass;