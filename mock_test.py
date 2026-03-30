from unittest.mock import MagicMock
import sys

# Mocking genlayer and bigint
class MockGenLayer:
    def __init__(self):
        self.public = MagicMock()
        self.public.write = lambda f: f
        self.public.view = lambda f: f
        
        self.message = MagicMock()
        self.message.sender_address = "test_address"
        
        # Mock eq_principle_strict_eq to just run the function
        def mock_eq(func):
            return func()
        self.eq_principle_strict_eq = mock_eq
        
        # Mock exec_prompt
        self.exec_prompt = MagicMock(return_value="PAY_FREELANCER")
        
        self.Contract = object

# Create the mock module
mock_gl = MockGenLayer()
sys.modules['genlayer'] = MagicMock(gl=mock_gl, bigint=int)

# Now we can import our contract
import sys, os
sys.path.append(os.path.join(os.path.dirname(__file__), 'contracts'))
from gen_resolve import GenResolve

def test_resolve_freelance():
    contract = GenResolve()
    print("Owner:", contract.get_owner())
    
    # Test freelance dispute
    print("\n--- Testing resolve_freelance_dispute ---")
    result = contract.resolve_freelance_dispute("Build website", "Here is website")
    print(f"Verdict: {result}")
    print(f"Dispute Count: {contract.get_dispute_count()}")
    
    # Change mock for next test
    mock_gl.exec_prompt.return_value = "YES"
    print("\n--- Testing resolve_prediction_market ---")
    result = contract.resolve_prediction_market("Is the sky blue?")
    print(f"Verdict: {result}")
    print(f"Dispute Count: {contract.get_dispute_count()}")

if __name__ == "__main__":
    test_resolve_freelance()
    print("\n[✓] Fase 2 Tests Passed Locally!")
