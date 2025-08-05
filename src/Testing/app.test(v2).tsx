/**
 * @file app.test.ts
 * @author Your Name (Senior Software & ML Engineer)
 * @description
 *
 * Tệp này đóng vai trò là Test Case Orchestrator trong Testing Bounded Context,
 * hiện thực hóa các yêu cầu trong "Đặc tả Kỹ thuật & Yêu cầu Nghiệp vụ cho app.test.ts v3".
 *
 * Nó được thiết kế để kiểm thử các đơn vị logic nghiệp vụ cốt lõi (Core Business Logic)
 * và các thành phần giao diện người dùng (UI Components) ở cấp độ Unit Test và Component Test,
 * tạo thành tầng đáy vững chắc của Test Pyramid.
 *
 * Tệp này tận dụng triệt để hạ tầng kiểm thử doanh nghiệp được cung cấp bởi `setupTest.ts`,
 * bao gồm các tiện ích mocking, quản lý trạng thái, và các pre-execution hooks,
 * để đảm bảo môi trường kiểm thử là Deterministic, Idempotent, và Isolated.
 */


// File này có cao cấp hay không ?
// // Có, vì nó sử dụng các kỹ thuật kiểm thử hiện đại như mocking, isolation, và component testing,
//Mức độ cao cấp so sánh với app.test(v3).tsx thì sao ? 
// giúp đảm bảo chất lượng mã nguồn và tính ổn định của ứng dụng.
// // Mức độ cao cấp của tệp này so với app.test(v3).tsx là cao hơn, vì nó áp dụng các nguyên tắc kiểm thử hiện đại và kỹ thuật tiên tiến hơn,


// --- I. CORE IMPORTS & SETUP ---
// Vitest core functions for defining test suites, test cases, and assertions.
import { describe, it, expect, beforeEach, vi } from 'vitest';

// React Testing Library for rendering and interacting with UI components in a simulated DOM.
// Giả định rằng các thư viện này đã được cài đặt trong dự án.
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// Import các tiện ích cao cấp từ hạ tầng kiểm thử đã được thiết lập.
// Đây là cầu nối quan trọng, đảm bảo sự hiệp đồng giữa hai file.
import { testUtils } from '@/Testing/setupTest';

// --- II. MOCK DEFINITIONS & TEST DATA FACTORIES ---
// Định nghĩa các kiểu dữ liệu (types) và interface để sử dụng trong các test case.
// Điều này đảm bảo Type Safety, một yêu cầu quan trọng trong đặc tả.
interface User {
  id: string;
  name: string;
  email: string;
  lastLogin: Date;
}

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  isOnSale: boolean;
}

// Interface cho một Repository, một design pattern phổ biến để trừu tượng hóa tầng truy cập dữ liệu.
interface IUserRepository {
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<User>;
}

// Sử dụng Test Data Factory để tạo dữ liệu test nhất quán và dễ quản lý,
// tránh "magic strings" và "magic numbers" theo yêu cầu của đặc tả.
const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: 'user-001',
  name: 'Lam Phong',
  email: 'phong.lam@te4gri.com',
  lastLogin: new Date('2025-07-24T10:00:00Z'),
  ...overrides,
});

const createMockProduct = (overrides: Partial<Product> = {}): Product => ({
  id: 'prod-123',
  name: 'TE4GRI AI Fertilizer',
  price: 150.0,
  description: 'Next-gen fertilizer powered by AI.',
  isOnSale: false,
  ...overrides,
});


// --- III. UNIT TESTS FOR CORE BUSINESS LOGIC ---
/**
 * @description
 * Nhóm test case này tập trung vào việc kiểm thử một đơn vị logic nghiệp vụ: UserService.
 * Tuân thủ nguyên tắc Unit Test: Mọi phụ thuộc bên ngoài (ở đây là IUserRepository)
 * đều phải được mock hoàn toàn để cô lập (isolate) logic của UserService.
 */
describe('UserService - Core Business Logic', () => {
  // --- Arrange (Global for this suite) ---
  // Sử dụng testUtils.createMock từ setupTests.ts để tạo một mock type-safe.
  // Mock này sẽ được reset tự động sau mỗi test case bởi logic trong `afterEach` của setupTests.ts.
  const mockUserRepository = testUtils.createMock<IUserRepository>();

  // Lớp UserService cần được kiểm thử.
  // Nó phụ thuộc vào IUserRepository (Dependency Injection).
  class UserService {
    constructor(private userRepository: IUserRepository) {}

    async getUserDetails(id: string): Promise<User> {
      if (!id || typeof id !== 'string') {
        throw new Error('Invalid user ID provided.');
      }
      const user = await this.userRepository.findById(id);
      if (!user) {
        throw new Error(`User with ID ${id} not found.`);
      }
      return user;
    }

    async updateUserLogin(id: string): Promise<User> {
        const user = await this.getUserDetails(id);
        const updatedUser = { ...user, lastLogin: new Date() };
        return this.userRepository.save(updatedUser);
    }
  }

  // Khởi tạo service với mock dependency.
  const userService = new UserService(mockUserRepository);

  // beforeEach hook để reset trạng thái của mock trước mỗi test,
  // đảm bảo nguyên tắc "Fresh Fixture" và tính cô lập của test case.
  beforeEach(() => {
    // vi.resetAllMocks() được gọi toàn cục trong setupTests.ts,
    // nhưng chúng ta có thể thực hiện các reset cụ thể hơn ở đây nếu cần.
    // Ví dụ: reset một mock implementation cụ thể cho từng test.
    vi.mocked(mockUserRepository.findById).mockReset();
    vi.mocked(mockUserRepository.save).mockReset();
  });

  /**
   * @description
   * Test case "happy path": Kiểm tra hành vi đúng đắn của hệ thống khi đầu vào hợp lệ.
   * Tên test case mô tả rõ hành vi: "should return a user when given a valid ID".
   */
  it('should return user details for a valid ID', async () => {
    // --- Arrange ---
    const mockUser = createMockUser({ id: 'valid-id' });
    // Cấu hình mock để trả về dữ liệu giả định khi phương thức findById được gọi.
    vi.mocked(mockUserRepository.findById).mockResolvedValue(mockUser);

    // --- Act ---
    // Thực thi hành động cần kiểm thử.
    const user = await userService.getUserDetails('valid-id');

    // --- Assert ---
    // Xác minh kết quả.
    expect(user).toBeDefined();
    expect(user.id).toBe('valid-id');
    expect(user.name).toBe(mockUser.name);
    // Kiểm tra rằng mock đã được gọi đúng cách.
    expect(mockUserRepository.findById).toHaveBeenCalledTimes(1);
    expect(mockUserRepository.findById).toHaveBeenCalledWith('valid-id');
  });

  /**
   * @description
   * Test case cho luồng lỗi (Error Handling): Đảm bảo hệ thống xử lý lỗi một cách graceful.
   */
  it('should throw an error if the user is not found', async () => {
    // --- Arrange ---
    const nonExistentId = 'non-existent-id';
    // Cấu hình mock để trả về null, mô phỏng trường hợp không tìm thấy user.
    vi.mocked(mockUserRepository.findById).mockResolvedValue(null);

    // --- Act & Assert ---
    // Kiểm tra rằng một promise sẽ bị reject với một lỗi cụ thể.
    // Đây là cách chuẩn để test các hàm async throw error.
    await expect(userService.getUserDetails(nonExistentId))
      .rejects
      .toThrow(`User with ID ${nonExistentId} not found.`);

    expect(mockUserRepository.findById).toHaveBeenCalledWith(nonExistentId);
  });

  /**
   * @description
   * Test case cho trường hợp biên (Edge Case) & đầu vào không hợp lệ (Negative Testing).
   */
  it('should throw an error for invalid input', async () => {
    // --- Arrange, Act & Assert ---
    // Kiểm tra với các giá trị null, undefined, và không phải string.
    await expect(userService.getUserDetails(null as any)).rejects.toThrow('Invalid user ID provided.');
    await expect(userService.getUserDetails(undefined as any)).rejects.toThrow('Invalid user ID provided.');
    await expect(userService.getUserDetails(123 as any)).rejects.toThrow('Invalid user ID provided.');

    // Đảm bảo rằng repository không bao giờ được gọi với đầu vào không hợp lệ.
    expect(mockUserRepository.findById).not.toHaveBeenCalled();
  });
});


// --- IV. COMPONENT TESTS FOR UI ---
/**
 * @description
 * Nhóm test case này tập trung vào việc kiểm thử một UI Component: ProductCard.
 * Tuân thủ nguyên tắc Component Test: Kiểm thử hành vi của component trong môi trường
 * giả lập DOM (jsdom), cô lập nó khỏi các component cha/con hoặc các API bên ngoài.
 */
describe('ProductCard Component - UI Behavior', () => {

  // Định nghĩa một React component đơn giản để kiểm thử.
  const ProductCard: React.FC<{ product: Product; onAddToCart: (productId: string) => void }> = ({ product, onAddToCart }) => {
    return (
      <div data-testid={`product-card-${product.id}`} className="product-card">
        {product.isOnSale && <span className="sale-badge">SALE</span>}
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <p className="price">${product.price.toFixed(2)}</p>
        <button onClick={() => onAddToCart(product.id)}>Add to Cart</button>
      </div>
    );
  };

  /**
   * @description
   * Test case kiểm tra việc hiển thị (rendering) chính xác dựa trên props đầu vào.
   */
  it('should display product details correctly', () => {
    // --- Arrange ---
    const product = createMockProduct({ name: 'Test Product', price: 99.99 });
    const mockOnAddToCart = vi.fn(); // Mock callback function

    // --- Act ---
    // Render component vào DOM ảo.
    render(<ProductCard product={product} onAddToCart={mockOnAddToCart} />);

    // --- Assert ---
    // Sử dụng các query của @testing-library/react để tìm các element trên màn hình.
    // Các query này mô phỏng cách người dùng tìm kiếm nội dung.
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByText(/Next-gen fertilizer/i)).toBeInTheDocument(); // Case-insensitive match
  });

  /**
   * @description
   * Test case kiểm tra tương tác của người dùng (user interaction).
   */
  it('should call the onAddToCart callback with product ID when button is clicked', () => {
    // --- Arrange ---
    const product = createMockProduct({ id: 'prod-abc' });
    const mockOnAddToCart = vi.fn(); // Tạo một mock function để theo dõi các lần gọi.

    render(<ProductCard product={product} onAddToCart={mockOnAddToCart} />);

    // --- Act ---
    // Tìm nút "Add to Cart" và mô phỏng hành động click của người dùng.
    const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(addToCartButton);

    // --- Assert ---
    // Kiểm tra rằng hàm callback đã được gọi đúng 1 lần và với đúng tham số.
    expect(mockOnAddToCart).toHaveBeenCalledTimes(1);
    expect(mockOnAddToCart).toHaveBeenCalledWith('prod-abc');
  });

  /**
   * @description
   * Test case kiểm tra logic hiển thị có điều kiện (conditional rendering).
   */
  it('should display a "SALE" badge if the product is on sale', () => {
    // --- Arrange ---
    const onSaleProduct = createMockProduct({ isOnSale: true });
    const mockOnAddToCart = vi.fn();

    // --- Act ---
    render(<ProductCard product={onSaleProduct} onAddToCart={mockOnAddToCart} />);

    // --- Assert ---
    // Kiểm tra sự tồn tại của badge "SALE".
    expect(screen.getByText('SALE')).toBeInTheDocument();
  });

  it('should NOT display a "SALE" badge if the product is not on sale', () => {
    // --- Arrange ---
    const notOnSaleProduct = createMockProduct({ isOnSale: false });
    const mockOnAddToCart = vi.fn();

    // --- Act ---
    render(<ProductCard product={notOnSaleProduct} onAddToCart={mockOnAddToCart} />);

    // --- Assert ---
    // queryByText sẽ trả về null nếu không tìm thấy, phù hợp để kiểm tra sự vắng mặt của element.
    expect(screen.queryByText('SALE')).not.toBeInTheDocument();
  });

  /**
   * @description
   * Snapshot Testing: Một kỹ thuật mạnh mẽ để đảm bảo UI không thay đổi ngoài ý muốn.
   * Lần đầu chạy, nó sẽ tạo một file "snapshot". Các lần chạy sau sẽ so sánh
   * kết quả render với snapshot đó.
   */
  it('should match the snapshot', () => {
    // --- Arrange ---
    const product = createMockProduct();
    const mockOnAddToCart = vi.fn();

    // --- Act ---
    const { container } = render(<ProductCard product={product} onAddToCart={mockOnAddToCart} />);

    // --- Assert ---
    // So sánh cấu trúc DOM đã render với snapshot đã lưu.
    expect(container).toMatchSnapshot();
  });
});


// --- V. ADVANCED TESTING CONCEPTS (Demonstration) ---
/**
 * @description
 * Phần này minh họa các khái niệm kiểm thử nâng cao được đề cập trong đặc tả,
 * như micro-benchmarking, để thể hiện sự toàn diện của chiến lược kiểm thử.
 */
describe('Advanced Concepts: Performance Micro-benchmarking', () => {
    // Lưu ý: Để chạy benchmark, cần cấu hình Vitest và có thể cần file riêng.
    // Đây là ví dụ mang tính minh họa về cú pháp và ý tưởng.
    // Lệnh chạy sẽ là `npx vitest bench`.

    // it.bench('performance of a complex calculation', () => {
    //   // Code để benchmark ở đây
    //   const performComplexCalculation = () => Array.from({ length: 1000 }, (_, i) => i * i).reduce((a, b) => a + b, 0);
    //   performComplexCalculation();
    // }, { time: 1000 }); // Chạy trong 1000ms để lấy mẫu
});

// --- END OF FILE ---
// Kết quả của các test trong file này sẽ được thu thập, tổng hợp vào báo cáo Code Coverage
// và các metrics khác bởi hạ tầng CI/CD, cung cấp dữ liệu quan trọng cho bảng điều khiển
// chất lượng của dự án TE4GRI, đúng theo tầm nhìn dài hạn trong đặc tả.
