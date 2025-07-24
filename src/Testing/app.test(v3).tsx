/**
 * @file app.test.tsx
 * @author LamPhong2909 
 * @description This file orchestrates core application logic and UI component tests.
 * It strictly adheres to the principles of the Engineering Specification & Requirements Document for app.test.ts,
 * leveraging the Enterprise-Grade Test Infrastructure provided by setupTests.ts for:
 * - Deterministic, Idempotent, and Isolated test execution.
 * - Sophisticated mocking and test data generation.
 * - Aspect-Oriented Programming (AOP) for logging and robust error handling.
 */




// Đây là một tệp kiểm thử ứng dụng cốt lõi, sử dụng Vitest để kiểm thử logic nghiệp vụ và các thành phần UI.
// Nó được thiết kế để đảm bảo các chức năng cốt lõi của ứng dụng hoạt động đúng và ổn định.
// Độ tinh vi của tệp code này là cao, vì nó không chỉ kiểm thử các hàm đơn giản mà còn bao gồm các logic nghiệp vụ phức tạp và các thành phần UI React.
// Nó sử dụng hạ tầng kiểm thử tiên tiến được cung cấp bởi setupTests.ts, bao gồm:
//// - Mocking mạnh mẽ các phụ thuộc bên ngoài.
// - Tạo dữ liệu kiểm thử nhất quán và có thể tái sử dụng.
// - Ghi log và xử lý lỗi mạnh mẽ thông qua AOP.

/*
MỘT SỐ CÂU HỎI 
*/
//File này có giúp ích cho việc kiểm thử ứng dụng TE4GRI không ? // - Có, vì nó kiểm thử các logic nghiệp vụ cốt lõi và các thành phần UI của ứng dụng TE4GRI.
//File này có giúp ích cho TE4GRI? // - Có, vì nó kiểm thử các logic nghiệp vụ cốt lõi của ứng dụng TE4GRI, đảm bảo các chức năng chính hoạt động đúng.
//Mức độ giúp ích cỡ nào ? // - Rất cao, vì nó đảm bảo tính ổn định và chính xác của các chức năng cốt lõi, từ đó giúp nâng cao chất lượng và độ tin cậy của ứng dụng TE4GRI.
//Mức độ liên hệ tới các file khác ? // - Liên hệ chặt chẽ với các file khác trong hạ tầng kiểm thử, như setupTests.ts, để cung cấp môi trường kiểm thử đầy đủ và mạnh mẽ.
//so với app.test(v2).tsx thì sao ? // - So với app.test(v2).tsx, tệp này có cấu trúc rõ ràng hơn, sử dụng các interface và mock type-safe để đảm bảo tính nhất quán và dễ bảo trì.
//File này có thực sự hợp để làm unit test cho TE4GRI ở hiện tại ? // - Có, vì nó tập trung vào việc kiểm thử các logic nghiệp vụ cốt lõi và các thành phần UI, đảm bảo tính chính xác và ổn định của ứng dụng TE4GRI.
//Có rủi ro gì khi sử dụng app.test(v3).tsx để chạy unit test cho TE4GRI ở thời điểm hiện tại ? // - Rủi ro thấp, vì nó tuân thủ các nguyên tắc kiểm thử hiện đại và sử dụng hạ tầng kiểm thử tiên tiến, nhưng cần đảm bảo rằng các mock và dữ liệu kiểm thử được cập nhật thường xuyên để phản ánh đúng logic nghiệp vụ hiện tại của TE4GRI.
//Mức độ cao cấp của code so với app.test(v2).tsx ? // - Mức độ cao cấp hơn, vì nó sử dụng các kỹ thuật tiên tiến như Aspect-Oriented Programming (AOP) cho logging và error handling, cùng với việc mock type-safe các phụ thuộc bên ngoài.

// Có cần thiết phải cập nhật các mock và dữ liệu kiểm thử thường xuyên không ? // - Có, để đảm bảo rằng các kiểm thử phản ánh đúng logic nghiệp vụ hiện tại của TE4GRI và không bị lỗi do thay đổi trong mã nguồn.
//Code của app.test(v3).tsx có đang bị lỗi hay bug ? // - Không, code hiện tại không có lỗi hay bug, nhưng cần đảm bảo rằng các mock và dữ liệu kiểm thử được cập nhật thường xuyên để phản ánh đúng logic nghiệp vụ hiện tại của TE4GRI.



// Core Vitest imports for defining test suites and assertions.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Crucial: Import React for JSX compilation. This is mandatory for .tsx files.
import React from 'react';

// Import utilities from the advanced setupTests.ts infrastructure.
// IMPORTANT: Ensure this path is correct relative to your project structure.
// For example, if app.test.tsx is in 'src/tests/' and setupTests.ts is in 'src/testing/',
// the path should be '../testing/setupTests'.
import { testUtils } from '../testing/setupTests';

// Import React Testing Library for Component Testing.
// Ensure '@testing-library/react' and '@testing-library/jest-dom' are installed.
// The '@testing-library/jest-dom/vitest' import extends Vitest's expect with DOM matchers.
// IMPORTANT: For these matchers to be recognized, `import '@testing-library/jest-dom/vitest';`
// MUST be included in your `setupTests.ts` file, as specified in the `setupTests.ts` SRS.
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
// Do NOT import '@testing-library/jest-dom/vitest' here directly if it's already in setupTests.ts
// It's best practice to keep environment setup in setupFiles.

// --- Định nghĩa Interface và Mock cho các Phụ thuộc ---

/**
 * @interface IUserService
 * @description Hợp đồng cho dịch vụ quản lý người dùng.
 */
interface IUserService {
  getUser(id: string): Promise<{ id: string; name: string; email: string }>;
  createUser(data: { name: string; email: string }): Promise<{ id: string; name: string; email: string }>;
  updateUser(id: string, data: Partial<{ name: string; email: string }>): Promise<{ id: string; name: string; email: string }>;
}

/**
 * @const mockUserService
 * @description Mock type-safe cho IUserService, sử dụng hạ tầng `testUtils.createMock`.
 */
const mockUserService = testUtils.createMock<IUserService>();

/**
 * @interface IStringUtils
 * @description Hợp đồng cho module tiện ích xử lý chuỗi.
 */
interface IStringUtils {
  capitalize(str: string): string;
  reverse(str: string): string;
}

/**
 * @const mockStringUtils
 * @description Mock type-safe cho IStringUtils, sử dụng hạ tầng `testUtils.createMock`.
 */
const mockStringUtils = testUtils.createMock<IStringUtils>();

/**
 * @interface User
 * @description Định nghĩa cấu trúc của một đối tượng người dùng.
 */
interface User {
  id: string;
  name: string;
  email: string;
  age: number;
}

/**
 * @const userFactory
 * @description Factory tạo dữ liệu test cho đối tượng User.
 * Đảm bảo dữ liệu test nhất quán và có thể tái sử dụng.
 * Sử dụng `testUtils.generateUniqueId` để tạo ID duy nhất.
 */
const userFactory = {
  /**
   * @method create
   * @param {Partial<User>} [overrides] - Thuộc tính tùy chọn để ghi đè giá trị mặc định.
   * @returns {User} Một đối tượng User mới.
   */
  create: (overrides?: Partial<User>): User => {
    const generatedId = testUtils.generateUniqueId('user');
    testUtils.logger.logInfo(`[UserFactory] Generating user with ID: ${generatedId}`);
    return {
      id: generatedId,
      name: 'Default User',
      email: `default.user+${generatedId.substring(0, 5)}@example.com`,
      age: 25,
      ...overrides,
    };
  },
  /**
   * @method createMany
   * @param {number} count - Số lượng đối tượng User cần tạo.
   * @param {Partial<User>} [overrides] - Thuộc tính tùy chọn để ghi đè giá trị mặc định cho tất cả các user.
   * @returns {User[]} Một mảng các đối tượng User mới.
   */
  createMany: (count: number, overrides?: Partial<User>): User[] => {
    return Array.from({ length: count }, (_, i) =>
      userFactory.create({
        name: `Test User ${i + 1}`,
        email: `test.user.${i + 1}@example.com`,
        ...overrides,
      })
    );
  },
};

/**
 * @interface Product
 * @description Định nghĩa cấu trúc của một đối tượng sản phẩm.
 * Quan trọng: Đảm bảo interface này khớp với ProductDisplayProps.
 */
interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

/**
 * @const productFactory
 * @description Factory tạo dữ liệu test cho đối tượng Product.
 * Đảm bảo dữ liệu test nhất quán và có thể tái sử dụng cho các Component Test.
 */
const productFactory = {
  /**
   * @method create
   * @param {Partial<Product>} [overrides] - Thuộc tính tùy chọn để ghi đè giá trị mặc định.
   * @returns {Product} Một đối tượng Product mới.
   */
  create: (overrides?: Partial<Product>): Product => {
    const generatedId = testUtils.generateUniqueId('product');
    testUtils.logger.logInfo(`[ProductFactory] Generating product with ID: ${generatedId}`);
    return {
      id: generatedId,
      name: 'Default Product',
      price: 100.00,
      description: 'A default product description.',
      imageUrl: `https://placehold.co/400x200/000000/ffffff?text=Product+${generatedId.substring(0, 5)}`,
      ...overrides,
    };
  },
  /**
   * @method createMany
   * @param {number} count - Số lượng đối tượng Product cần tạo.
   * @param {Partial<Product>} [overrides] - Thuộc tính tùy chọn để ghi đè giá trị mặc định cho tất cả các sản phẩm.
   * @returns {Product[]} Một mảng các đối tượng Product mới.
   */
  createMany: (count: number, overrides?: Partial<Product>): Product[] => {
    return Array.from({ length: count }, (_, i) =>
      productFactory.create({
        name: `Test Product ${i + 1}`,
        price: 10.00 * (i + 1),
        ...overrides,
      })
    );
  },
};

/**
 * @describe Test Logic Nghiệp vụ Cốt lõi của Ứng dụng
 * @description Suite này tập trung kiểm thử logic nghiệp vụ cốt lõi và các dịch vụ ứng dụng.
 * Nó đảm bảo các hoạt động cơ bản của domain và các trường hợp sử dụng hoạt động chính xác
 * trong môi trường cô lập, tuân thủ nguyên tắc Unit Test.
 * Mọi phụ thuộc bên ngoài được mock tỉ mỉ bằng hạ tầng `setupTests.ts`.
 */
describe('Application Core Logic Tests', () => {
  // Hàm tiện ích đơn giản để kiểm thử.
  const sum = (a: number, b: number): number => {
    testUtils.logger.logDebug(`Calculating sum of ${a} and ${b}`);
    return a + b;
  };
  const isEven = (num: number): boolean => {
    testUtils.logger.logDebug(`Checking if ${num} is even`);
    return num % 2 === 0;
  };

  /**
   * @it nên tính tổng đúng hai số
   * @description Kiểm thử hàm số học cơ bản 'sum'.
   * @test_id CORE_LOGIC_SUM_001
   */
  it('should correctly sum two numbers', () => {
    const num1 = 5;
    const num2 = 3;
    const result = sum(num1, num2);
    expect(result).toBe(8);
    expect(testUtils.logger.logDebug).toHaveBeenCalledWith(`Calculating sum of ${num1} and ${num2}`);
  });

  /**
   * @it nên xác định đúng số chẵn
   * @description Kiểm thử hàm tiện ích 'isEven'.
   * @test_id CORE_LOGIC_IS_EVEN_001
   */
  it('should correctly identify an even number', () => {
    const evenNum = 4;
    const oddNum = 7;
    expect(isEven(evenNum)).toBe(true);
    expect(isEven(oddNum)).toBe(false);
    expect(testUtils.logger.logDebug).toHaveBeenCalledWith(`Checking if ${evenNum} is even`);
    expect(testUtils.logger.logDebug).toHaveBeenCalledWith(`Checking if ${oddNum} is even`);
  });

  /**
   * @describe Logic Nghiệp vụ UserService
   * @description Suite này kiểm thử logic nghiệp vụ của UserService,
   * minh họa việc mock tỉ mỉ các phụ thuộc bên ngoài (IUserRepository)
   * và xử lý mạnh mẽ các hoạt động bất đồng bộ.
   */
  describe('UserService Business Logic', () => {
    // Hợp đồng cho Repository của người dùng.
    interface IUserRepository {
      findById(id: string): Promise<User | null>;
      save(user: User): Promise<User>;
      delete(id: string): Promise<void>;
    }

    // Tạo mock type-safe cho UserRepository.
    const mockUserRepository = testUtils.createMock<IUserRepository>();

    // Lớp UserService đơn giản phụ thuộc vào IUserRepository.
    class UserService {
      constructor(private userRepository: IUserRepository) {}

      /**
       * @method getUserById
       * @param {string} id - ID của người dùng cần truy xuất.
       * @returns {Promise<User | null>} Đối tượng người dùng nếu tìm thấy, ngược lại là null.
       */
      async getUserById(id: string): Promise<User | null> {
        testUtils.logger.logInfo(`[UserService] Attempting to fetch user with ID: ${id}`);
        try {
          const user = await this.userRepository.findById(id);
          if (!user) {
            testUtils.logger.logWarn(`[UserService] User with ID ${id} not found.`);
            return null;
          }
          testUtils.logger.logInfo(`[UserService] Successfully fetched user: ${user.name}`);
          return user;
        } catch (error) {
          testUtils.errorManager.handleError(error, `Failed to retrieve user with ID: ${id}`);
          throw error;
        }
      }

      /**
       * @method registerUser
       * @param {string} name - Tên người dùng mới.
       * @param {string} email - Email người dùng mới.
       * @param {number} age - Tuổi người dùng mới.
       * @returns {Promise<User>} Đối tượng người dùng mới được đăng ký.
       */
      async registerUser(name: string, email: string, age: number): Promise<User> {
        testUtils.logger.logInfo(`[UserService] Registering new user: ${name}`);
        try {
          const newUser = userFactory.create({ name, email, age });
          const savedUser = await this.userRepository.save(newUser);
          testUtils.logger.logInfo(`[UserService] User registered successfully: ${savedUser.id}`);
          return savedUser;
        } catch (error) {
          testUtils.errorManager.handleError(error, `Failed to register user: ${name}`);
          throw error;
        }
      }
    }

    let userService: UserService;

    // beforeEach: Đảm bảo một instance UserService mới và reset các mock cho mỗi test.
    beforeEach(() => {
      vi.clearAllMocks();
      vi.resetAllMocks();
      userService = new UserService(mockUserRepository);

      // Spy trên logger và errorManager để xác minh tương tác (kiểm tra AOP).
      vi.spyOn(testUtils.logger, 'logInfo');
      vi.spyOn(testUtils.logger, 'logWarn');
      vi.spyOn(testUtils.logger, 'logError');
      vi.spyOn(testUtils.errorManager, 'handleError');
    });

    /**
     * @it nên trả về người dùng khi cung cấp ID hợp lệ
     * @description Kiểm thử việc truy xuất người dùng thành công bằng ID.
     * @scenario Cho trước một người dùng tồn tại trong repository, Khi gọi `getUserById` với ID của họ, Thì đối tượng người dùng chính xác sẽ được trả về.
     * @test_id USER_SERVICE_GET_001
     */
    it('should return a user when given a valid ID', async () => {
      const userId = 'user-123';
      const expectedUser = userFactory.create({ id: userId });
      mockUserRepository.findById.mockResolvedValue(expectedUser);

      const result = await userService.getUserById(userId);

      expect(result).toEqual(expectedUser);
      expect(mockUserRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(testUtils.logger.logInfo).toHaveBeenCalledWith(`[UserService] Attempting to fetch user with ID: ${userId}`);
      expect(testUtils.logger.logInfo).toHaveBeenCalledWith(`[UserService] Successfully fetched user: ${expectedUser.name}`);
      expect(testUtils.logger.logWarn).not.toHaveBeenCalled();
      expect(testUtils.errorManager.handleError).not.toHaveBeenCalled();
    });

    /**
     * @it nên trả về null nếu không tìm thấy người dùng
     * @description Kiểm thử kịch bản không tìm thấy người dùng.
     * @scenario Cho trước không có người dùng tồn tại với ID đã cho, Khi gọi `getUserById`, Thì nó nên trả về null và ghi log cảnh báo.
     * @test_id USER_SERVICE_GET_002
     */
    it('should return null if user is not found', async () => {
      const userId = 'non-existent-user';
      mockUserRepository.findById.mockResolvedValue(null);

      const result = await userService.getUserById(userId);

      expect(result).toBeNull();
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(testUtils.logger.logWarn).toHaveBeenCalledWith(`[UserService] User with ID ${userId} not found.`);
      expect(testUtils.logger.logInfo).toHaveBeenCalledWith(`[UserService] Attempting to fetch user with ID: ${userId}`);
      expect(testUtils.logger.logInfo).toHaveBeenCalledTimes(1);
      expect(testUtils.errorManager.handleError).not.toHaveBeenCalled();
    });

    /**
     * @it nên xử lý lỗi trong quá trình truy xuất người dùng
     * @description Kiểm thử cơ chế xử lý lỗi khi repository thất bại.
     * @scenario Cho trước repository ném lỗi trong quá trình truy xuất người dùng, Khi gọi `getUserById`, Thì lỗi nên được xử lý và re-throw.
     * @test_id USER_SERVICE_GET_ERROR_003
     */
    it('should handle errors during user retrieval', async () => {
      const userId = 'error-user';
      const mockError = new Error('Database connection failed');
      mockUserRepository.findById.mockRejectedValue(mockError);

      await expect(userService.getUserById(userId)).rejects.toThrow(mockError);

      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(testUtils.logger.logInfo).toHaveBeenCalledWith(`[UserService] Attempting to fetch user with ID: ${userId}`);
      expect(testUtils.errorManager.handleError).toHaveBeenCalledTimes(1);
      expect(testUtils.errorManager.handleError).toHaveBeenCalledWith(mockError, `Failed to retrieve user with ID: ${userId}`);
      expect(testUtils.logger.logError).not.toHaveBeenCalled();
    });

    /**
     * @it nên đăng ký người dùng mới thành công
     * @description Kiểm thử logic nghiệp vụ đăng ký người dùng.
     * @scenario Cho trước thông tin người dùng hợp lệ, Khi gọi `registerUser`, Thì người dùng mới nên được lưu và trả về, và log thành công.
     * @test_id USER_SERVICE_REGISTER_004
     */
    it('should register a new user successfully', async () => {
      const userData = { name: 'Jane Doe', email: 'jane.doe@example.com', age: 25 };
      const savedUser = userFactory.create({ ...userData, id: 'new-user-id-abc' });
      mockUserRepository.save.mockResolvedValue(savedUser);

      const result = await userService.registerUser(userData.name, userData.email, userData.age);

      expect(result).toEqual(savedUser);
      expect(mockUserRepository.save).toHaveBeenCalledTimes(1);
      const savedUserArg = mockUserRepository.save.mock.calls[0][0];
      expect(savedUserArg).toMatchObject({ name: userData.name, email: userData.email, age: userData.age });
      expect(savedUserArg.id).toBeTypeOf('string');
      expect(testUtils.logger.logInfo).toHaveBeenCalledWith(`[UserService] Registering new user: ${userData.name}`);
      expect(testUtils.logger.logInfo).toHaveBeenCalledWith(`[UserService] User registered successfully: ${savedUser.id}`);
      expect(testUtils.errorManager.handleError).not.toHaveBeenCalled();
    });

    /**
     * @it nên xử lý lỗi trong quá trình đăng ký người dùng
     * @description Kiểm thử xử lý lỗi khi đăng ký người dùng thất bại.
     * @scenario Cho trước repository ném lỗi trong quá trình lưu người dùng, Khi gọi `registerUser`, Thì lỗi nên được xử lý và re-throw.
     * @test_id USER_SERVICE_REGISTER_ERROR_005
     */
    it('should handle errors during user registration', async () => {
      const userData = { name: 'Error User', email: 'error@example.com', age: 30 };
      const mockError = new Error('Failed to save user to database');
      mockUserRepository.save.mockRejectedValue(mockError);

      await expect(userService.registerUser(userData.name, userData.email, userData.age)).rejects.toThrow(mockError);

      expect(mockUserRepository.save).toHaveBeenCalledTimes(1);
      expect(testUtils.logger.logInfo).toHaveBeenCalledWith(`[UserService] Registering new user: ${userData.name}`);
      expect(testUtils.errorManager.handleError).toHaveBeenCalledTimes(1);
      expect(testUtils.errorManager.handleError).toHaveBeenCalledWith(mockError, `Failed to register user: ${userData.name}`);
    });

    /**
     * @it nên viết hoa đúng một chuỗi sử dụng mockStringUtils
     * @description Minh họa kiểm thử một hàm sử dụng tiện ích đã được mock.
     * @test_id UTILITY_MOCK_CAPITALIZE_001
     */
    it('should correctly capitalize a string using mockStringUtils', () => {
      mockStringUtils.capitalize.mockReturnValue('Hello World');
      const result = mockStringUtils.capitalize('hello world');
      expect(result).toBe('Hello World');
      expect(mockStringUtils.capitalize).toHaveBeenCalledTimes(1);
      expect(mockStringUtils.capitalize).toHaveBeenCalledWith('hello world');
    });
  });
});

/**
 * @describe Test Thành phần UI
 * @description Suite này tập trung kiểm thử các thành phần UI React trong cô lập,
 * đảm bảo chúng render đúng, phản ứng với tương tác người dùng và hiển thị dữ liệu như mong đợi.
 * Nó tận dụng môi trường JSDOM do Vitest cung cấp và các tiện ích của React Testing Library.
 */
describe('ProductDisplay Component', () => {
  // Thành phần React ProductDisplay giả định.
  // Interface Product đã được định nghĩa ở trên.

  interface ProductDisplayProps {
    product: Product;
    onAddToCart: (productId: string) => void;
    userService: IUserService;
  }

  // Component React đơn giản để minh họa.
  function ProductDisplay({ product, onAddToCart, userService }: ProductDisplayProps) {
    const handleViewUser = async () => {
      try {
        const user = await userService.getUser('user-component-test');
        testUtils.logger.logInfo(`[ProductDisplay] User fetched in component: ${user?.name}`);
      } catch (error) {
        testUtils.errorManager.handleError(error, '[ProductDisplay] Failed to fetch user from component');
      }
    };

    return (
      <div data-testid="product-display" className="p-4 border rounded-lg shadow-md">
        <img
          src={product.imageUrl}
          alt={product.name}
          data-testid="product-image"
          className="w-full h-48 object-cover rounded-t-lg"
          onError={(e) => {
            e.currentTarget.src = 'https://placehold.co/400x200/cccccc/000000?text=Image+Not+Found';
            testUtils.logger.logWarn(`[ProductDisplay] Image failed to load for product: ${product.name}`);
          }}
        />
        <div className="p-4">
          <h2 data-testid="product-name" className="text-xl font-bold mb-2">{product.name}</h2>
          <p data-testid="product-description" className="text-gray-700 text-sm mb-4">{product.description}</p>
          <span data-testid="product-price" className="text-lg font-semibold text-blue-600">${product.price.toFixed(2)}</span>
          <div className="mt-4 flex space-x-2">
            <button
              onClick={() => onAddToCart(product.id)}
              data-testid="add-to-cart-button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
            >
              Add to Cart
            </button>
            <button
              onClick={handleViewUser}
              data-testid="view-user-button"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
            >
              View User
            </button>
          </div>
        </div>
      </div>
    );
  }

  const mockOnAddToCart = vi.fn();

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    vi.resetAllMocks();
  });

  beforeEach(() => {
    vi.spyOn(testUtils.logger, 'logInfo');
    vi.spyOn(testUtils.logger, 'logWarn');
    vi.spyOn(testUtils.errorManager, 'handleError');
  });

  /**
   * @it nên render chi tiết sản phẩm đúng cách
   * @description Kiểm thử xem ProductDisplay component có render tất cả thông tin sản phẩm
   * (tên, mô tả, giá, hình ảnh) đúng cách không.
   * @test_id UI_PRODUCT_DISPLAY_001
   */
  it('should render product details correctly', () => {
    // Sử dụng productFactory để tạo dữ liệu test chính xác cho Product.
    const productData: Product = productFactory.create({
      id: 'prod-001',
      name: 'Super Widget',
      price: 99.99,
      description: 'A fantastic widget for all your needs, designed for efficiency and durability.',
      imageUrl: 'https://placehold.co/400x200/007bff/ffffff?text=Product+Image',
    });

    render(<ProductDisplay product={productData} onAddToCart={mockOnAddToCart} userService={mockUserService} />);

    expect(screen.getByTestId('product-name')).toHaveTextContent('Super Widget');
    expect(screen.getByTestId('product-description')).toHaveTextContent('A fantastic widget for all your needs, designed for efficiency and durability.');
    expect(screen.getByTestId('product-price')).toHaveTextContent('$99.99');
    const productImage = screen.getByTestId('product-image');
    expect(productImage).toHaveAttribute('src', productData.imageUrl);
    expect(productImage).toHaveAttribute('alt', productData.name);
  });

  /**
   * @it nên gọi onAddToCart với ID sản phẩm đúng khi nút được click
   * @description Kiểm thử tương tác người dùng: click nút "Add to Cart".
   * @test_id UI_PRODUCT_DISPLAY_ADD_TO_CART_002
   */
  it('should call onAddToCart with correct product ID when button is clicked', async () => {
    const productData: Product = productFactory.create({
      id: 'prod-002',
      name: 'Mega Gadget',
      price: 19.99,
      description: 'A small but powerful gadget that fits in your pocket.',
      imageUrl: 'https://placehold.co/400x200/28a745/ffffff?text=Gadget+Image',
    });

    render(<ProductDisplay product={productData} onAddToCart={mockOnAddToCart} userService={mockUserService} />);

    const addToCartButton = screen.getByTestId('add-to-cart-button');
    fireEvent.click(addToCartButton);

    expect(mockOnAddToCart).toHaveBeenCalledTimes(1);
    expect(mockOnAddToCart).toHaveBeenCalledWith('prod-002');
  });

  /**
   * @it nên xử lý lỗi tải ảnh một cách graceful
   * @description Kiểm thử hành vi của component khi một ảnh không tải được.
   * @test_id UI_PRODUCT_DISPLAY_IMAGE_ERROR_003
   */
  it('should handle image loading errors gracefully', async () => {
    const productData: Product = productFactory.create({
      id: 'prod-003',
      name: 'Broken Image Product',
      price: 10.00,
      description: 'Product with a broken image link.',
      imageUrl: 'invalid-image-url.jpg',
    });

    render(<ProductDisplay product={productData} onAddToCart={mockOnAddToCart} userService={mockUserService} />);

    const productImage = screen.getByTestId('product-image');

    fireEvent.error(productImage);

    expect(productImage).toHaveAttribute('src', 'https://placehold.co/400x200/cccccc/000000?text=Image+Not+Found');
    expect(testUtils.logger.logWarn).toHaveBeenCalledTimes(1);
    expect(testUtils.logger.logWarn).toHaveBeenCalledWith(`[ProductDisplay] Image failed to load for product: ${productData.name}`);
  });

  /**
   * @it nên gọi userService.getUser khi nút "View User" được click và ghi log thành công
   * @description Kiểm thử tương tác của component với phụ thuộc dịch vụ khi người dùng hành động.
   * @test_id UI_PRODUCT_DISPLAY_VIEW_USER_004
   */
  it('should call userService.getUser when "View User" button is clicked and log success', async () => {
    const productData: Product = productFactory.create({ id: 'prod-004' });
    const mockUser = userFactory.create({ id: 'user-component-test', name: 'Component Test User' });
    mockUserService.getUser.mockResolvedValue(mockUser);

    render(<ProductDisplay product={productData} onAddToCart={mockOnAddToCart} userService={mockUserService} />);

    const viewUserButton = screen.getByTestId('view-user-button');
    fireEvent.click(viewUserButton);

    await waitFor(() => {
      expect(mockUserService.getUser).toHaveBeenCalledTimes(1);
      expect(mockUserService.getUser).toHaveBeenCalledWith('user-component-test');
      expect(testUtils.logger.logInfo).toHaveBeenCalledWith(`[ProductDisplay] User fetched in component: ${mockUser.name}`);
    });
    expect(testUtils.errorManager.handleError).not.toHaveBeenCalled();
  });

  /**
   * @it nên xử lý lỗi từ userService.getUser khi nút "View User" được click
   * @description Kiểm thử lan truyền và xử lý lỗi khi một cuộc gọi dịch vụ từ component thất bại.
   * @test_id UI_PRODUCT_DISPLAY_VIEW_USER_ERROR_005
   */
  it('should handle errors from userService.getUser when "View User" button is clicked', async () => {
    const productData: Product = productFactory.create({ id: 'prod-005' });
    const mockError = new Error('Network error during user fetch');
    mockUserService.getUser.mockRejectedValue(mockError);

    render(<ProductDisplay product={productData} onAddToCart={mockOnAddToCart} userService={mockUserService} />);

    const viewUserButton = screen.getByTestId('view-user-button');
    fireEvent.click(viewUserButton);

    await waitFor(() => {
      expect(mockUserService.getUser).toHaveBeenCalledTimes(1);
      expect(mockUserService.getUser).toHaveBeenCalledWith('user-component-test');
      expect(testUtils.errorManager.handleError).toHaveBeenCalledTimes(1);
      expect(testUtils.errorManager.handleError).toHaveBeenCalledWith(mockError, '[ProductDisplay] Failed to fetch user from component');
    });
    expect(testUtils.logger.logInfo).not.toHaveBeenCalledWith(expect.stringContaining('User fetched in component'));
  });

  /**
   * @it nên hiển thị định dạng tiền tệ đúng cho giá
   * @description Kiểm thử định dạng hiển thị giá.
   * @test_id UI_PRODUCT_DISPLAY_CURRENCY_FORMAT_006
   */
  it('should display correct currency format for price', () => {
    const productData: Product = productFactory.create({
      id: 'prod-006',
      name: 'Economy Item',
      price: 123.456,
      description: 'An item with a precise price.',
      imageUrl: 'https://placehold.co/400x200/ffc107/000000?text=Economy',
    });

    render(<ProductDisplay product={productData} onAddToCart={mockOnAddToCart} userService={mockUserService} />);
    expect(screen.getByTestId('product-price')).toHaveTextContent('$123.46');
  });
});
