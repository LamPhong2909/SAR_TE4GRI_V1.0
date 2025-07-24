// This file is part of the OpenCTI project.
// File này có chức năng là kiểm thử ứng dụng, đảm bảo các chức năng cơ bản hoạt động đúng.
//// Nó sử dụng Vitest, một framework kiểm thử cho JavaScript và TypeScript, để thực hiện các bài kiểm thử đơn giản.




import { describe, it, expect } from 'vitest';



describe('Application Tests', () => {
	it('hello world!', () => {
		expect(1 + 1).toBe(2);
	});
});



//  npx Vitest